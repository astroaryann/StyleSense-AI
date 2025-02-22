// Gemini API key
const API_KEY = 'AIzaSyDqxamSkFqymrxua0Fh3YhrD9jJVDQUSA0'; // Replace with your Gemini API key

// Function to upload image and analyze
async function uploadImage() {
    const fileInput = document.getElementById('imageUpload');
    const image = fileInput.files[0];

    if (!image) {
        alert('Please upload an image first.');
        return;
    }

    console.log('File selected:', image); // Debugging

    // Show loading spinner
    document.getElementById('loading').style.display = 'block';

    try {
        // Step 1: Convert the image to a base64 string
        const reader = new FileReader();
        reader.onload = async (event) => {
            const base64Image = event.target.result.split(',')[1]; // Remove the data URL prefix
            console.log('Base64 image:', base64Image); // Debugging

            // Step 2: Send the base64 image to the Gemini API
            const response = await fetch('https://api.gemini.ai/v1/analyze-image', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${API_KEY}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ image: base64Image }),
            });

            const geminiData = await response.json();
            console.log('Gemini API response:', geminiData); // Debugging

            // Step 3: Display the result
            displayResult(base64Image, geminiData.suggestion);

            // Show pop-up message
            showPopup('Image uploaded successfully!');
        };
        reader.readAsDataURL(image); // Read the image as a data URL
    } catch (error) {
        console.error('Error:', error); // Debugging
        alert('An error occurred. Please try again.');
    } finally {
        // Hide loading spinner
        document.getElementById('loading').style.display = 'none';
    }
}

// Function to display the result
function displayResult(imageUrl, suggestion) {
    const resultCard = document.getElementById('result');
    const uploadedImage = document.getElementById('uploadedImage');
    const suggestionText = document.getElementById('suggestion');

    // Display the uploaded image
    uploadedImage.src = `data:image/png;base64,${imageUrl}`;
    uploadedImage.style.display = 'block';

    // Display the AI-generated suggestion with a personalized message
    suggestionText.innerHTML = `
        <strong>Aryan's Suggestion:</strong> ${suggestion || 'No suggestion available.'}
    `;

    // Show the result card
    resultCard.style.display = 'block';
}

// Function to show a pop-up message
function showPopup(message) {
    const popup = document.getElementById('popup');
    popup.querySelector('span').textContent = message;
    popup.style.display = 'flex';

    // Hide the pop-up after 3 seconds
    setTimeout(() => {
        popup.style.display = 'none';
    }, 3000);
}
