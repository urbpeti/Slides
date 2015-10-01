# Maxwhere Slides

A tiny web-based tool to create simple slideshows and place its slides around a Where by url.
This is a first draft so no every details are touched. Do it creatively and discuss frequently!

## Definitions

**Slideshow:** A sequence of images. Each images has a unique URL and accessible publicly e.g.:
```
http://www.maxwhere.com/slideshow-id/slide-number
```

## Features

Maxwhere Slides provide the following features through web GUI users can
- **sign in** (with the Maxwhere login module)
- **create slideshows**
- **delete** existing slideshows
- **fill up** the slideshows with images (drag n drop welcomed)
- **reorder** and **delete** the slides
- copy the slides URL to the clipboard

## Detailed characteristics

- The URL of a slide loads only the image fitted to the browser screen
- If the owner of a Slideshow is signed in on the machine, the slides can be updated by dragging a new image over the existing one.
- The URL  http://www.maxwhere.com/slideshow-id refers to the admin page of the given Slideshow.
- Images are stored in the **IBM Softlayer** object storage (account can be created by GP)
- **IBM CloudAnt** database should be used to store slides document
- In database design we should consider the following future requirements:
  - Slideshow owner should be able to grant edit rights for others.
  - Not only images but other media content shall be supported in the future (e.g., video, audio, reveal.js slides, etc..)
