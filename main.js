import '/style.css'

const imageUrls = [];

for (let i = 1; i <= document.getElementById('magazine').children.length; i++) {
  imageUrls.push(`/images/${i}.png`);
}

const loadingScreen = document.getElementById('loading-screen');
const progressBar = document.getElementById('loading-progress');
const loadingText = document.getElementById('loading-text');

function loadImage(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = url;
  });
}

async function loadImages() {
  try {
    const loadedImages = [];

    for (let i = 0; i < imageUrls.length; i++) {
      const img = await loadImage(imageUrls[i]);
      loadedImages.push(img);

      // Update progress
      const progress = ((i + 1) / imageUrls.length) * 100;
      progressBar.value = progress;
      loadingText.textContent = `${Math.round(progress)}%`;
    }

    let hint = true
    $('#magazine').turn({ gradients: true, acceleration: true, when: { turning: () => { hint = false } } });

    const regex = /\?(\d+)$/; // Captures the number after the question mark
    const match = window.location.href.match(regex);
    $('#magazine').turn("page", match ? match[1] : 1)

    setInterval(() => {
      if (hint == true) {
        $('#magazine').turn("peel", "tr");
      }
    }, 1000)

    setInterval(() => {
      if (hint == true) {
        $('#magazine').turn("peel", false);
      }
    }, 2000)

    setInterval(() => {
      document.getElementById("arrow").classList.toggle("invisible")
    }, 1000)

    // Hide loading screen and show images
    loadingScreen.classList.add("hidden")
  } catch (error) {
    console.error('Image loading failed:', error);
    loadingText.textContent = 'Loading failed. Please refresh.';
  }
}

// Start loading images when page loads
loadImages()