from django.shortcuts import render
from django.http import JsonResponse
import os
from google import genai
import json
from django.views.decorators.csrf import csrf_exempt
from dotenv import load_dotenv

load_dotenv()
def index(request):
    return render(request, 'index.html')

@csrf_exempt
def gemini_request(request):
    if request.method == 'POST':
        try:
            # 1. Get the API key securely from environment variables
            GEMINI_API_KEY = os.environ.get('GEMINI_API_KEY')
            
            if not GEMINI_API_KEY:
                return JsonResponse({'error': 'GEMINI_API_KEY environment variable is not set'}, status=500)
            
            # 2. Initialize the Gemini client by passing the API key directly to the Client object
            client = genai.Client(api_key=GEMINI_API_KEY)
            model = client.GenerativeModel('gemini-1.5-pro')

            # 3. Parse the incoming JSON data from the front end
            body_unicode = request.body.decode('utf-8')
            body_data = json.loads(body_unicode)
            interests = body_data.get('interests')
            portfolio_data = body_data.get('portfolioData')

            if not interests or not portfolio_data:
                return JsonResponse({'error': 'Missing interests or portfolio data in request'}, status=400)

            # 4. Construct the prompt for the Gemini API
            prompt_text = f"""
            A recruiter is interested in the following: "{interests}".
            Here is my full portfolio data: {json.dumps(portfolio_data, indent=2)}.
            
            Please create a tailored JSON response for a web portfolio.
            The response should have the following keys:
            1. 'bio': A 2-3 sentence bio highlighting skills relevant to the recruiter's interests.
            2. 'talkingPoints': A list of 3-4 bullet points highlighting key skills and projects.
            3. 'projects': An array of the most relevant projects from my portfolio data.
            4. 'skills': The entire skills dictionary, but you can reorder categories to highlight the most relevant.
            5. 'certifications': An array of the most relevant certifications.
            
            Return ONLY the JSON object. Do not include any extra text, markdown formatting like ```json, or explanations outside the JSON object itself.
            """

            # 5. Call the Gemini API and get the response
            gemini_response = model.generate_content(prompt_text)
            
            # 6. Parse the AI's response and return it to the front end.
            adapted_data = json.loads(gemini_response.text)

            return JsonResponse(adapted_data, safe=False)

        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON in request body'}, status=400)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
    
    return JsonResponse({'error': 'Only POST requests are accepted'}, status=405)

def recomandation(request):
    return render(request,'recommendations.html')

from django.core.mail import send_mail, get_connection

def contact_hub(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            name = data.get('name', 'Anonymous')
            email = data.get('email', '')
            message = data.get('message', '')
            
            host_user = os.getenv('EMAIL_HOST_USER')
            host_password = os.getenv('EMAIL_HOST_PASSWORD')

            if not host_user or not host_password:
                # Simulation Mode (Graceful Fallback)
                print(f"Warning: EMAIL_HOST_USER or PASSWORD not set. Simulating email from {name}.")
                return JsonResponse({
                    'status': 'success', 
                    'message': 'Transmission Complete (Simulation Mode - Set Env Vars for Real Email)',
                    'simulation': True
                })

            # Explicit Connection with Runtime Credentials
            connection = get_connection(
                host='smtp.gmail.com',
                port=587,
                username=host_user,
                password=host_password,
                use_tls=True
            )

            # Real Send
            send_mail(
                subject=f"Neural Uplink from {name}",
                message=f"Source ID: {name}\nReturn Vector: {email}\n\nPayload:\n{message}",
                from_email=host_user,
                recipient_list=['gouravbirwaz@gmail.com'],
                connection=connection, # Use the explicit connection
                fail_silently=False,
            )
            return JsonResponse({'status': 'success', 'message': 'Transmission Complete'})
        except Exception as e:
            # Return specific error instead of generic 500
            print(f"Email Error: {str(e)}")
            return JsonResponse({'status': 'error', 'message': f"Transmission Error: {str(e)}"}, status=500)
            
    return render(request, 'contact_hub.html')