# Version 0.3.5 - Now 17% less ugly

Finally, replaced the stock JavaScript/Chrome video player with something more stylish. And also more functional as
it now features a loop function that lets you see the 1.5 second loop that is going to be selected.

### Features
* New video player
* Rotate a video! 90, 180 or even 270 degrees!
* Preview and loop the 1.5 sec video snippet
* Respect the image rotation from Metadata
* Video preview modal now accepts clicks outside and the ESC key as a cancel action

### Internals
* We have migrations now! We won't update the database that often (hopefully), but at least now we can!
* Updated the dev libs
* Including latest eslint which in turn forced us to ...
* ... rename components to respect multi-word-name constraint

### Bugfixes
* Opening a video from the calendar will jump to the saved timestamp
* No more squashed preview images
* All dates in the video should be the same size
