<?php
/*
Credits: Bit Repository
URL: http://www.bitrepository.com/
*/

//include 'config.php';

define("WEBMASTER_EMAIL", 'info@hernanzubiri.com.ar');

error_reporting (E_ALL ^ E_NOTICE);

$post = (!empty($_POST)) ? true : false;

if($post)
{
include 'functions.php';

$name = stripslashes($_POST['nombre']);
$email = trim($_POST['email']);
$subject = stripslashes($_POST['asunto']);
$message = stripslashes($_POST['mensaje']);


$error = '';

// Check name

if(!$name)
{
$error .= 'Por favor ingresa tu nombre.<br />';
}

// Check email

if(!$email)
{
$error .= 'Por favor ingresa tu e-mail.<br />';
}

if($email && !ValidateEmail($email))
{
$error .= 'Por favor ingresa un e-mail valido.<br />';
}

// Check message (length)

if(!$message || strlen($message) < 15)
{
$error .= "Por favor ingresa tu mensaje. Debe tener al menos 15 caracteres.<br />";
}


if(!$error)
{

$datos= "Mensaje enviado por \r\n"
    ."Nombre: ".$name."\r\n"
    ."Email: ".$email."\r\n"
    ."\r\n \r\n"
    .$message;


$mail = mail(WEBMASTER_EMAIL, $subject, $datos,
     "From: ".$name." <".$email.">\r\n"
    ."Reply-To: ".$email."\r\n"
    ."X-Mailer: PHP/" . phpversion());


if($mail)
{
$data = array(
    'success' => true,
    'message' => 'Gracias por contactarse con nosotros. A la brevedad le responderemos sus inquietudes. '
    );

    echo json_encode($data);
}

}
else
{
    $data = array(
        'success' => true,
        'message' => $error
    );

    echo json_encode($data);
}

}
?>