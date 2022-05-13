# Version 0.3.6 - Crashes less ofter

Every now and then the whole render process crashed with just a little
'lol no' notification. Then you'd have to go partially render the timeline
until you finally found the video that causes the error. That was absolutely
no fun. Now, the merge command used is no longer from the node-fluent-ffmpeg
lib, but a simple spawn and command line FFMPEG. That seems to be much more
stable.

### Bugfixes
* Merging videos should crash at least less often
