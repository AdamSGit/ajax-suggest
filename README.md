# What is ajax-suggest ?

Ajax suggest is a small jquery plugin that provide a suggestion list in input elements. Really simple to use, you can (of course) use it with ajax, but also give it directly a javascript map object already existing in your scope.

## How it works

This plugin allow a text input element to display a suggestion list (like google search, for example) which evolve gradually when the user type his request.

This plugin can work in two distinct ways :

### With ajax

You give a url to the plugin during initialization. This URL points to a server-side handler (sample php handler in the demo files). This handler must retrieve data from a file or a database, browse the data to filter the related results and return them as JSON object. With this method, the research through the datas must be done by the server-side handler.

### With scope object

What if the data you want to search through is in a javascript array of objects, already in your scope ? You can pass this object directly during initialisation as well. (Please note that if you pass both an url and a scope object, the scope object will have the priority). With this method, the research through the datas is done by the plugin directly.

Demo, doc and download: http://adamsantoro.fr/projects/ajax-suggest

Copyright (c) 2014 Adam Santoro (http://adamsantoro.fr)
Licensed under the GPL license. (http://www.opensource.org/licenses/gpl-license.php)