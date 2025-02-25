document.getElementById('uploadButton').addEventListener('click', async () => {
    const photoInput = document.getElementById('photoInput');
    if (photoInput.files.length === 0) {
        alert('Please select a photo to upload.');
        return;
    }

    const file = photoInput.files[0];
    const reader = new FileReader();

    reader.onload = async (event) => {
        const base64Image = event.target.result;

        // Google GenAI API endpoint and API key
        const genaiApiEndpoint = 'https://api.genai.cloud/v1alpha/models/gemini-2.0-flash:generateContent';
        const genaiApiKey = 'AIzaSyCD3MarmhXZhQkqB89g47OCU7snV62KGWc';

        try {
            const response = await fetch(genaiApiEndpoint, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${genaiApiKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    contents: `Analyze and provide recommendations based on the uploaded photo: ${base64Image}`
                })
            });

            if (!response.ok) {
                throw new Error('Failed to analyze photo');
            }

            const result = await response.json();
            document.getElementById('result').innerText = `AI's recommendation: ${result.text}`;
        } catch (error) {
            document.getElementById('result').innerText = `Error: ${error.message}`;
        }
    };

    reader.readAsDataURL(file);
});
