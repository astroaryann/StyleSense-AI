// Supabase configuration
const SUPABASE_URL = 'https://wdfddsfbssmnaymoutxl.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndkZmRkc2Zic3NtbmF5bW91dHhsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAyMzQ2MDgsImV4cCI6MjA1NTgxMDYwOH0.f-HRHm01MtkFzsoRQyrnSDLqVnz6NfZkIYIUaNajL30';

// Initialize Supabase
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Gemini AI API key
const API_KEY = 'AIzaSyDqxamSkFqymrxua0Fh3YhrD9jJVDQUSA0';

// Function to upload image to Supabase Storage
async function uploadImage() {
    const fileInput = document.getElementById('imageUpload');
    const image = fileInput.files[0];

    if (!image) {
        alert('Please upload an image first.');
        return;
    }

    // Show loading spinner
    document.getElementById('loading').style.display = 'block';

    try {
        // Step 1: Upload the image to Supabase Storage
        const fileName = `${Date.now()}-${image.name}`;
        const { data, error } = await supabase.storage
            .from('images') // Your bucket name
            .upload(fileName, image);

        if (error) {
            throw error;
        }

        // Step 2: Get the public URL of the uploaded image
        const { data: urlData } = supabase.storage
            .from('images')
            .getPublicUrl(fileName);

        const imageUrl = urlData.publicUrl;

        // Step 3: Send the image URL to the Gemini AI API
        const response = await fetch('https://api.gemini.ai/v1/analyze-image', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ image_url: imageUrl }),
        });

        const geminiData = await response.json();

        // Step 4: Display the result
        displayResult(imageUrl, geminiData.suggestion);
    } catch (error) {
        console.error('Error:', error);
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
    uploadedImage.src = imageUrl;
    uploadedImage.style.display = 'block';

    // Display the AI-generated suggestion with a personalized message
    suggestionText.innerHTML = `
        <strong>Aryan's Suggestion:</strong> ${suggestion || 'No suggestion available.'}
    `;

    // Show the result card
    resultCard.style.display = 'block';
}
