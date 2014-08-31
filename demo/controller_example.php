<?php 

/*!
Ajax-suggest, a small jquery plugin adding google-like suggestion 
list on input typing

Version 0.1.0
Full source at https://github.com/harvesthq/chosen
Copyright (c) 2014 Adam Santoro http://adamsantoro.fr

This plugin is released on GPL licence
*/



/* 
This is an example of a really basic controller in PHP. For other 
implementations, if you do some, send me a pull request and i will 
add them to the github plugin repo 
*/ 

class Example {

	/* Methods */

	public static function action_controller_example() {

		if(isset($_POST['val']) and $_POST['val'])
		{
			// The value isset and is not empty. Next
			
			/* 
			   This example controller work with a json file
			   For a database research, replace the following :
			*/
		
		    $data = json_decode(file_get_contents(__DIR__ . '/countries.json'), true);
		    
		    /*
		       By your database request
		     */
		    
	       	$val = $_POST['val'];

	       	$output = array();

	       	foreach($data as $value)
	       	{
	       		// Replace ['name'] by your field name in which you're seeking for matches
	       		if(strstr(strtolower($value['name']), strtolower($val)) !== false)
	       		{
	       			$output[] = $value;
	       		}
	       	}

	       	if($output)
	       	{
	       		echo json_encode($output);
	       	}

		}

	}

}

// Run the controller

Example::action_controller_example();