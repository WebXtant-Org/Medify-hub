from PIL import Image
import os
import sys

def rotate_images():
    files = [
        r"d:\Projects\Medify-hub\public\images\gallery-small-1.jpg",
        r"d:\Projects\Medify-hub\public\images\gallery-small-2.jpg"
    ]

    for f in files:
        if os.path.exists(f):
            try:
                img = Image.open(f)
                # Rotate -90 (90 degrees Clockwise)
                # We use expand=True to adjust dimensions
                img_rotated = img.rotate(-90, expand=True)
                img_rotated.save(f)
                print(f"Successfully rotated {f}")
            except Exception as e:
                print(f"Error rotating {f}: {e}")
        else:
            print(f"File not found: {f}")

if __name__ == "__main__":
    try:
        import PIL
        rotate_images()
    except ImportError:
        print("Pillow not installed. Please run: pip install Pillow")
        sys.exit(1)
