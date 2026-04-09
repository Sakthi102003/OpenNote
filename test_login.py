import requests

url = "https://opennote-backend.onrender.com/api/v1/auth/login"
data = {
    "username": "test@test.com",
    "password": "abc"
}

print(f"Sending POST request to {url}...")
try:
    response = requests.post(url, data=data)
    print(f"Status Code: {response.status_code}")
    print("\nResponse Body:")
    print(response.text)
except Exception as e:
    print(f"Error occurred: {e}")
