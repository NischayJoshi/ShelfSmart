# Test Images

This directory contains sample images for testing the ShelfSmart application.

## Sample Images

- `sample-shelf.jpg` - A synthetic shelf image with colored product boxes

## Usage

Use these images to test the `/analyze` endpoint:

```bash
# Using curl
curl -X POST -F "file=@test-images/sample-shelf.jpg" http://localhost:8000/analyze

# Using the frontend
1. Start the frontend: npm run frontend
2. Click "Choose File" and select an image from this directory
3. Click "Analyze Shelf"
```

## Adding Your Own Images

You can add your own retail shelf images to this directory for testing. Supported formats:
- JPEG (.jpg, .jpeg)
- PNG (.png)
- BMP (.bmp)
- GIF (.gif)

## Note

The test-images directory is included in .gitignore, so your test images won't be committed to the repository.
