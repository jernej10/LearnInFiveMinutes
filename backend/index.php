<?php
require 'vendor/autoload.php';
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
header('Access-Control-Allow-Methods: *');
require __DIR__ . '/cookie.php';

// USTVARJANJE NOVE POVEZAVE NA PODATKOVNO BAZO
$povezava = new PDO('mysql:host='.$host.';dbname='.$imePodatkovneBaze.';charset=utf8mb4', $uporabniskoIme, $geslo);
  
$app = new \Slim\App([
  'settings' => [
    'displayErrorDetails' => true
  ]
]);


$app->add(function ($request, $response, $next) {
  $response = $next($request, $response);
  return $response->withHeader('Access-Control-Allow-Origin', 'http://localhost:3000')
  ->withHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Accept, Origin, Authorization')
  ->withHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS')
  ->withHeader('Access-Control-Allow-Credentials', 'true');
});

$app->get('/', function () {
  echo 'Welcome to my slim app';
});

$mw = function ($request, $response, $next) use($povezava) {
  $cookie = new Cookie();
  $token = $cookie->getCookieValue($request, "token");
  $poizvedba = $povezava->prepare("SELECT token, idUporabnik FROM uporabnik WHERE token = :token;"); 
  $poizvedba->bindValue(':token', $token);
  $poizvedba->execute();

  $rezultat = $poizvedba->fetch(\PDO::FETCH_OBJ);

  if($rezultat !=  false) {
    $request = $request->withAttribute('idUporabnik', $rezultat->idUporabnik);
    $response = $next($request, $response);
    return $response;
  } else {
    return $response->withStatus(401);
  }
};

//pridobi videje glede na iskan niz
$app->get('/video/search/{iskanVideo}', function ($request, $response, array $args) use($povezava) {
  $iskanNiz = $args['iskanVideo'];
  $poizvedba = $povezava->prepare(
    "SELECT video.*, uporabnik.imeKanala, uporabnik.slikaProfilaPot, zvrst.imeZvrsti, COUNT(idUporabnikVideo) as steviloOgledov, SUM(jeVseckal) as steviloVseckov
    FROM video INNER JOIN uporabnik ON video.TK_idUporabnik = uporabnik.idUporabnik
    INNER JOIN zvrst ON video.TK_idZvrst = zvrst.idZvrst
    LEFT JOIN uporabnik_video ON uporabnik_video.TK_idVideo = video.idVideo
    WHERE video.naslov LIKE '%{$iskanNiz}%' OR uporabnik.imeKanala LIKE '%{$iskanNiz}%'
    GROUP BY video.idVideo
    ORDER BY steviloOgledov DESC LIMIT 10;
    "); 
  $poizvedba->execute();

  $rezultat = $poizvedba->fetchAll(\PDO::FETCH_OBJ);
  echo json_encode($rezultat);
});

//pridobi podatke o statiskiti
$app->get('/statistics', function () use($povezava) {
  $queries = [
    "SELECT COUNT(idVideo) * 5 as steviloMinutVidejov FROM video;",
    "SELECT COUNT(idVideo) as steviloVidejov FROM video;",
    "SELECT COUNT(idUporabnik) as steviloUporabnikov FROM uporabnik;"
  ];

  $data = array();

  foreach ($queries as $query) {
    $poizvedba = $povezava->prepare($query);
    $poizvedba->execute();
    $rezultat = $poizvedba->fetchAll(\PDO::FETCH_OBJ);
    array_push($data, $rezultat[0]);
  }

  echo json_encode($data);
});

//pridobi komentarje videja
$app->get('/comments/{id}', function ($request, $response, array $args) use($povezava) {
  $idUporabnika = $request->getAttribute('idUporabnik');
  $idVideo = $args['id'];
  $poizvedba = $povezava->prepare(
    "SELECT uporabnik.imeKanala, uporabnik.email, uporabnik.slikaProfilaPot, komentar.vsebina, komentar.datum
    FROM uporabnik
    JOIN komentar ON komentar.TK_idUporabnik = uporabnik.idUporabnik
    WHERE komentar.TK_idVideo = '${idVideo}';
    "); 
  $poizvedba->execute();

  $rezultat = $poizvedba->fetchAll(\PDO::FETCH_OBJ);
  echo json_encode($rezultat);
})->add($mw);

// vnese komentar
$app->post('/comments', function ($request, $response, $args) use($povezava) {
  $idUporabnika = $request->getAttribute('idUporabnik');

  $input = $request->getParsedBody();
  $vsebina = $input['vsebina'];
  $idVideo = $input['idVideo'];

  $poizvedba = $povezava->prepare('INSERT INTO komentar (vsebina, TK_idUporabnik, TK_idVideo, datum) VALUES (:vsebina, :idUporabnika, :idVideo, :datum)'); 
  // PRIPRAVA VREDNOSTI
  $poizvedba->bindValue(':vsebina', $vsebina);
  $poizvedba->bindValue(':idUporabnika', $idUporabnika);
  $poizvedba->bindValue(':idVideo', $idVideo);
  $poizvedba->bindValue(':datum', date('Y-m-d'));


  // DEJANSKA IZVEDBA POIZVEDBE
  $poizvedba->execute();

  // ID NAZADNJE VSTAVLJENE VRSTICE
  $idVstavljeneVrstice = $povezava->lastInsertId();

  echo $idVstavljeneVrstice;

})->add($mw);

//pridobi zvrsti videjov
$app->get('/videos/zvrsti', function () use($povezava) {
  $poizvedba = $povezava->prepare('SELECT imeZvrsti FROM zvrst'); 
  $poizvedba->execute();

  $rezultat = $poizvedba->fetchAll(\PDO::FETCH_OBJ);
  echo json_encode($rezultat);
});

//pridobi vse drzave
$app->get('/users/countries', function () use($povezava) {
  $poizvedba = $povezava->prepare('SELECT * FROM drzava'); 
  $poizvedba->execute();

  $rezultat = $poizvedba->fetchAll(\PDO::FETCH_OBJ);
  echo json_encode($rezultat);
});

//pridobi zadnjih 10 videov
$app->get('/videos', function () use($povezava) {
  $poizvedba = $povezava->prepare(
    'SELECT video.*, uporabnik.imeKanala, uporabnik.slikaProfilaPot, zvrst.imeZvrsti, COUNT(idUporabnikVideo) as steviloOgledov, SUM(jeVseckal) as steviloVseckov
    FROM video INNER JOIN uporabnik ON video.TK_idUporabnik = uporabnik.idUporabnik
    INNER JOIN zvrst ON video.TK_idZvrst = zvrst.idZvrst
    LEFT JOIN uporabnik_video ON uporabnik_video.TK_idVideo = video.idVideo
    GROUP BY video.idVideo
    ORDER BY video.idVideo DESC LIMIT 10;
    '); 
  $poizvedba->execute();

  $rezultat = $poizvedba->fetchAll(\PDO::FETCH_OBJ);
  echo json_encode($rezultat);
});

// login
$app->post('/login', function ($request, $response, $args) use($povezava, $app) {
  $input = $request->getParsedBody();
  $email = $input['email'];
  $geslo = $input['geslo'];
  $poizvedba = $povezava->prepare("SELECT * FROM uporabnik WHERE email = '$email' AND geslo= '$geslo'"); 
  $poizvedba->execute();

  $rezultat = $poizvedba->fetch(\PDO::FETCH_OBJ);

  if($rezultat !=  false) {
    $token = sha1(time());
    $poizvedba2 = $povezava->prepare("UPDATE uporabnik SET token = :token WHERE idUporabnik = $rezultat->idUporabnik");
    $poizvedba2->bindValue(':token', $token); 
    $poizvedba2->execute();
    $cookie = new Cookie();
    $response = $cookie->addCookie($response, "token", $token);
    $body = $response->getBody();
    $body->write(json_encode($token));
  } else {
    $body = $response->getBody();
    $body->write(json_encode("napaka"));
  }

  return $response;
});

// registration
$app->post('/registration', function ($request, $response, $args) use($povezava) {
  $input = $request->getParsedBody();
  $email = $input['email'];
  $geslo = $input['geslo'];
  $letoRojstva = $input['letoRojstva'];
  $idDrzave = $input['idDrzave'];

  $poizvedba = $povezava->prepare('INSERT INTO uporabnik (email, geslo, letnicaRojstva, TK_idDrzava) VALUES (:email, :geslo, :letnicaRojstva, :TK_idDrzava)'); 
  // PRIPRAVA VREDNOSTI
  $poizvedba->bindValue(':email', $email);
  $poizvedba->bindValue(':geslo', $geslo);
  $poizvedba->bindValue(':letnicaRojstva', $letoRojstva);
  $poizvedba->bindValue(':TK_idDrzava', $idDrzave);

  // DEJANSKA IZVEDBA POIZVEDBE
  $poizvedba->execute();

  // ID NAZADNJE VSTAVLJENE VRSTICE
  $idVstavljeneVrstice = $povezava->lastInsertId();

  echo $idVstavljeneVrstice;

});

// make channel
$app->post('/makeChannel', function ($request, $response, $args) use($povezava, $app) {
  $idUporabnika = $request->getAttribute('idUporabnik');
  $uploadedFiles = $request->getUploadedFiles();
  $input = $request->getParsedBody();

  $container = $app->getContainer();
  $container['upload_directory'] =__DIR__  . '\\slike\\profile';

  // lokacija datoteke, kam shrani
  $directory = $container['upload_directory'];

  // handle single input with single file upload
  $uploadedFile = $uploadedFiles['file'];
  $channelName = $input['channel'];


  if ($uploadedFile->getError() === UPLOAD_ERR_OK) {
      $filename = moveUploadedFile($directory, $uploadedFile);

      $poizvedba = $povezava->prepare('UPDATE uporabnik SET imeKanala = :imeKanala, slikaProfilaPot = :slikaProfilaPot WHERE idUporabnik = :idUporabnika'); 
      $poizvedba->bindValue(':imeKanala', $channelName);
      $poizvedba->bindValue(':idUporabnika', $idUporabnika);
      $poizvedba->bindValue(':slikaProfilaPot', 'slike/profile/' . $filename);

      $poizvedba->execute();
  } 

 
  $body = $response->getBody();
  $body->write(json_encode($request));
  return $response;

})->add($mw);

// upload video
$app->post('/uploadVideo', function ($request, $response, $args) use($povezava, $app) {
  $idUporabnika = $request->getAttribute('idUporabnik');
  $uploadedFiles = $request->getUploadedFiles();
  $input = $request->getParsedBody();

  $container = $app->getContainer();
  $container['upload_directoryVideo'] =__DIR__  . '\\videji';
  $container['upload_directoryImg'] =__DIR__  . '\\slike\\thumbnail';

  // lokacija datoteke, kam shrani
  $directoryVideo = $container['upload_directoryVideo'];
  $directoryImg = $container['upload_directoryImg'];


  // handle single input with single file upload
  $uploadedVideo = $uploadedFiles['video'];
  $uploadedImg = $uploadedFiles['image'];
  $videoTitle = $input['naslov'];
  $videoDescription = $input['opis'];
  $videoZvrst = $input['zvrst'];



  if ($uploadedVideo->getError() === UPLOAD_ERR_OK) {
      $filenameVideo = moveUploadedFile($directoryVideo, $uploadedVideo);
      $filenameImg= moveUploadedFile($directoryImg, $uploadedImg);

      $poizvedba = $povezava->prepare('SELECT idZvrst FROM zvrst WHERE imeZvrsti = :imeZvrsti;'); 
      $poizvedba->bindValue(':imeZvrsti', $videoZvrst);
      $poizvedba->execute();
      $rezultat = $poizvedba->fetch(\PDO::FETCH_OBJ);


      $poizvedba = $povezava->prepare('INSERT INTO video (naslov, pot, datum, opisVideja, TK_idUporabnik, TK_idZvrst, slikaPot) VALUES (:naslov, :pot, :datum, :opisVideja, :TK_idUporabnik, :TK_idZvrst, :slikaPot);'); 
      $poizvedba->bindValue(':naslov', $videoTitle);
      $poizvedba->bindValue(':pot', $filenameVideo);
      $poizvedba->bindValue(':datum', date('Y-m-d'));
      $poizvedba->bindValue(':opisVideja', $videoDescription);
      $poizvedba->bindValue(':TK_idUporabnik', $idUporabnika);
      $poizvedba->bindValue(':TK_idZvrst', $rezultat->idZvrst); 
      $poizvedba->bindValue(':slikaPot', 'slike/thumbnail/' . $filenameImg);

      $poizvedba->execute();
  } 

 
  $body = $response->getBody();
  $body->write(json_encode($request));
  return $response;

})->add($mw);

//pridobi videje glede na zvrst
$app->get('/videos/{zvrst}', function ($request, $response, array $args) use($povezava) {
  $zvrst = $args['zvrst'];
  $poizvedba = $povezava->prepare(
    "SELECT video.*, uporabnik.imeKanala, uporabnik.slikaProfilaPot, zvrst.imeZvrsti, COUNT(idUporabnikVideo) as steviloOgledov, SUM(jeVseckal) as steviloVseckov
    FROM video INNER JOIN uporabnik ON video.TK_idUporabnik = uporabnik.idUporabnik
    INNER JOIN zvrst ON video.TK_idZvrst = zvrst.idZvrst
    LEFT JOIN uporabnik_video ON uporabnik_video.TK_idVideo = video.idVideo
    WHERE zvrst.imeZvrsti = '{$zvrst}'
    GROUP BY video.idVideo
    ORDER BY steviloOgledov DESC;
    "); 
  $poizvedba->execute();

  $rezultat = $poizvedba->fetchAll(\PDO::FETCH_OBJ);
  echo json_encode($rezultat);
});

//pridobi če je všečkal video
$app->get('/video/liked/{id}', function ($request, $response, array $args) use($povezava) {
  $idUporabnika = $request->getAttribute('idUporabnik');
  $idVideo = $args['id'];

  $poizvedba = $povezava->prepare('SELECT jeVseckal FROM uporabnik_video WHERE TK_idUporabnik = :idUporabnik AND TK_idVideo = :idVideo'); 
  $poizvedba->bindValue(':idUporabnik', $idUporabnika);
  $poizvedba->bindValue(':idVideo', $idVideo);

  $poizvedba->execute();

  $rezultat = $poizvedba->fetch(\PDO::FETCH_OBJ);
  echo json_encode($rezultat);
})->add($mw);

// like / dislike
$app->get('/video/like/{vseckal}/{id}', function ($request, $response, array $args) use($povezava) {
  $idUporabnika = $request->getAttribute('idUporabnik');
  $idVideo = $args['id'];
  $vseckal = filter_var($args['vseckal'], FILTER_VALIDATE_BOOLEAN);


  if($vseckal == true) {
    // dislike
    $poizvedba = $povezava->prepare('UPDATE uporabnik_video  SET jeVseckal = "0" WHERE TK_idUporabnik = :idUporabnik AND TK_idVideo = :idVideo'); 
    $poizvedba->bindValue(':idUporabnik', $idUporabnika);
    $poizvedba->bindValue(':idVideo', $idVideo);
  
    $poizvedba->execute();
  } else {
    // like
    $poizvedba = $povezava->prepare('UPDATE uporabnik_video  SET jeVseckal = "1" WHERE TK_idUporabnik = :idUporabnik AND TK_idVideo = :idVideo'); 
    $poizvedba->bindValue(':idUporabnik', $idUporabnika);
    $poizvedba->bindValue(':idVideo', $idVideo);
  
    $poizvedba->execute();
  }



  $rezultat = $poizvedba->fetch(\PDO::FETCH_OBJ);
  echo json_encode($rezultat);
})->add($mw);

//pridobi video, ki ga želi uporabniko pogledati
$app->get('/video/{id}', function ($request, $response, array $args) use($povezava) {
  $idUporabnika = $request->getAttribute('idUporabnik');
  $idVideo = $args['id'];
  $poizvedba = $povezava->prepare(
    "SELECT video.*, uporabnik.imeKanala, uporabnik.slikaProfilaPot, zvrst.imeZvrsti, COUNT(idUporabnikVideo) as steviloOgledov, SUM(jeVseckal) as steviloVseckov
    FROM video INNER JOIN uporabnik ON video.TK_idUporabnik = uporabnik.idUporabnik
    INNER JOIN zvrst ON video.TK_idZvrst = zvrst.idZvrst
    LEFT JOIN uporabnik_video ON uporabnik_video.TK_idVideo = video.idVideo
    WHERE video.idVideo = '{$idVideo}'
    GROUP BY video.idVideo
    ORDER BY video.idVideo;
    "); 
  $poizvedba->execute();

  $rezultat = $poizvedba->fetchAll(\PDO::FETCH_OBJ);
  echo json_encode($rezultat);
})->add($mw);

//pridobi priporočene videje brez gledanega videja
$app->get('/videos/recommended/{zvrst}/{id}', function ($request, $response, array $args) use($povezava) {
  $idUporabnika = $request->getAttribute('idUporabnik');
  $idVideja = $args['id'];
  $zvrst = $args['zvrst'];
  $poizvedba = $povezava->prepare(
    "SELECT video.*, uporabnik.imeKanala, uporabnik.slikaProfilaPot, zvrst.imeZvrsti, COUNT(idUporabnikVideo) as steviloOgledov, SUM(jeVseckal) as steviloVseckov
    FROM video INNER JOIN uporabnik ON video.TK_idUporabnik = uporabnik.idUporabnik
    INNER JOIN zvrst ON video.TK_idZvrst = zvrst.idZvrst
    LEFT JOIN uporabnik_video ON uporabnik_video.TK_idVideo = video.idVideo
    WHERE zvrst.imeZvrsti = '{$zvrst}' AND video.idVideo != '{$idVideja}'
    GROUP BY video.idVideo
    ORDER BY steviloOgledov DESC LIMIT 10;
    "); 
  $poizvedba->execute();

  $rezultat = $poizvedba->fetchAll(\PDO::FETCH_OBJ);
  echo json_encode($rezultat);
})->add($mw);

//pridobi podatke o uporabniku
$app->get('/user', function ($request, $response, array $args) use($povezava) {
  $idUporabnika = $request->getAttribute('idUporabnik');
  $poizvedba = $povezava->prepare(
    "SELECT uporabnik.email, uporabnik.imeKanala, drzava.nazivDrzave, uporabnik.slikaProfilaPot
    FROM uporabnik
    JOIN drzava ON drzava.idDrzava = uporabnik.TK_idDrzava
    WHERE uporabnik.idUporabnik = '{$idUporabnika}';
    "); 
  $poizvedba->execute();

  $rezultat = $poizvedba->fetchAll(\PDO::FETCH_OBJ);
  echo json_encode($rezultat);
})->add($mw);

//pridobi podatke o uporabnikovih videjih
$app->get('/user/videos', function ($request, $response, array $args) use($povezava) {
  $idUporabnika = $request->getAttribute('idUporabnik');
  $poizvedba = $povezava->prepare(
    "SELECT video.naslov, video.datum, video.idVideo
    FROM video
    JOIN uporabnik ON uporabnik.idUporabnik = video.TK_idUporabnik
    WHERE uporabnik.idUporabnik = '{$idUporabnika}';
    "); 
  $poizvedba->execute();

  $rezultat = $poizvedba->fetchAll(\PDO::FETCH_OBJ);
  echo json_encode($rezultat);
})->add($mw);

//izbrise video uporabnika
$app->get('/user/video/delete/{id}', function ($request, $response, array $args) use($povezava) {
  $idUporabnika = $request->getAttribute('idUporabnik');
  $idVideja = $args['id'];

  $poizvedba = $povezava->prepare(
    "DELETE FROM video
     WHERE idVideo = :id AND TK_idUporabnik = '{$idUporabnika}';
    ");
  $poizvedba->bindValue(':id', $idVideja);
  $poizvedba->execute();

  $rezultat = $poizvedba->fetchAll(\PDO::FETCH_OBJ);
  echo json_encode($rezultat);
})->add($mw);

// posodobi profil
$app->post('/user/update', function ($request, $response, $args) use($povezava) {
  $idUporabnika = $request->getAttribute('idUporabnik');

  $input = $request->getParsedBody();
  $drzava = $input['drzava'];
  $geslo = $input['geslo'];

  echo($geslo);

  $poizvedba = $povezava->prepare("SELECT idDrzava FROM drzava WHERE nazivDrzave = :nazivDrzave");
  $poizvedba->bindValue(':nazivDrzave', $drzava);
  $poizvedba->execute();

  $rezultat = $poizvedba->fetch(\PDO::FETCH_OBJ);

  $poizvedba2 = $povezava->prepare("UPDATE uporabnik SET geslo = :geslo, TK_idDrzava = :TK_idDrzava WHERE idUporabnik = $idUporabnika"); 
  $poizvedba2->bindValue(':geslo', $geslo);
  $poizvedba2->bindValue(':TK_idDrzava', $rezultat->idDrzava);

  $poizvedba2->execute();

  $rezultat2 = $poizvedba2->fetchAll(\PDO::FETCH_OBJ);

  $body = $response->getBody();
  $body->write(json_encode($rezultat2));
  return $response;


})->add($mw);

//vnese ogled
$app->get('/video/viewed/{id}', function ($request, $response, array $args) use($povezava) {
  $idUporabnika = $request->getAttribute('idUporabnik');
  $idVideja = $args['id'];

  $poizvedba = $povezava->prepare("SELECT * FROM uporabnik_video WHERE TK_idUporabnik = :TK_idUporabnik AND TK_idVideo = :TK_idVideo;");
  $poizvedba->bindValue(':TK_idUporabnik', $idUporabnika);
  $poizvedba->bindValue(':TK_idVideo', $idVideja);
  $poizvedba->execute();

  $rezultat = $poizvedba->fetch(\PDO::FETCH_OBJ);

  // če ne najde rezultata pomeni, da ta videjo še ni pogledal, zato ga vnese
  if($rezultat ==  false) {
    $poizvedba2 = $povezava->prepare("INSERT INTO uporabnik_video (jeVseckal, TK_idUporabnik, TK_idVideo) VALUES (:jeVseckal, :TK_idUporabnik, :TK_idVideo);");
    $poizvedba2->bindValue(':jeVseckal', 0);
    $poizvedba2->bindValue(':TK_idUporabnik', $idUporabnika);
    $poizvedba2->bindValue(':TK_idVideo', $idVideja);
  
    $poizvedba2->execute();
  
    $rezultat2 = $poizvedba2->fetchAll(\PDO::FETCH_OBJ);
    $body = $response->getBody();
    $body->write(json_encode($rezultat2));
  } else {
    $body = $response->getBody();
    $body->write(json_encode("Je že pogledal"));
  }

  return $response;

})->add($mw);

//pošlje email
$app->post('/sendemail', function ($request, $response, array $args) use($povezava) {
  require __DIR__ . '/phpmailer.php';

  $input = $request->getParsedBody();
  $email = $input['email'];

  if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $data = "Invalid email format";
  } else {
    try {
      $mail->addAddress($email);
      $mail->Subject = 'Subscription ' . $email . '!';
      $mail->Body = '<h2>Thanks for subscribing!</h2>
          <h4>We will send you new tutorials and special offers everday.</h4>
          <p>LearnInFiveMinutes</p>
      ';
      $mail->send();
      $data = "Email poslan";
  } catch (Exception $e) {
      $data = $mail->ErrorInfo;
  }
  }

  echo json_encode($data);
});

function moveUploadedFile($directory, $uploadedFile)
{
    $extension = pathinfo($uploadedFile->getClientFilename(), PATHINFO_EXTENSION);
    $basename = bin2hex(random_bytes(8));
    $filename = sprintf('%s.%0.8s', $basename, $extension);

    $uploadedFile->moveTo($directory . DIRECTORY_SEPARATOR . $filename);

    return $filename;
}


$app->run();


?>
