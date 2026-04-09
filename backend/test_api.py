import requests

def test_register():
    url = "https://opennote-backend.onrender.com/api/v1/auth/register"
    payload = {
        "email": "test2@test.com",
        "password": "abc",
        "full_name": "test"
    }
    
    print(f"Sending POST request to {url}...")
    try:
        response = requests.post(url, json=payload)
        print(f"Status Code: {response.status_code}")
        print(f"Response Body: {response.text}")
    except Exception as e:
        print(f"An error occurred: {e}")

if __name__ == "__main__":
    test_register()
