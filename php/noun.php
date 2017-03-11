<?php
    //Use this OAuth library -> http://oauth.googlecode.com/svn/code/php/OAuth.php
    require("OAuth.php");

    parse_str($_SERVER['QUERY_STRING']);
    
    header('Access-Control-Allow-Origin: *');
    header('Content-Type: application/json');

    $cc_key  = "a7373c9dc6d446db820ca53ddcb1a11d";
    $cc_secret = "7a1be4a946ce4077872a12321bf78a48";
    $url = "http://api.thenounproject.com/icons/".$query;
    $args = array();
    $args["limit"] = 40;
    $args["limit_to_public_domain"] = 1; //You'll have to buy Noun Pro to get SVGs
     
    $consumer = new OAuthConsumer($cc_key, $cc_secret);
    $request = OAuthRequest::from_consumer_and_token($consumer, NULL,"GET", $url, $args);
    $request->sign_request(new OAuthSignatureMethod_HMAC_SHA1(), $consumer, NULL);
    $url = sprintf("%s?%s", $url, OAuthUtil::build_http_query($args));
    $ch = curl_init();
    $headers = array($request->to_header());
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE);
    $rsp = curl_exec($ch);
    //$results = json_decode($rsp);
    //print_r($results);
    print_r($rsp)
?>