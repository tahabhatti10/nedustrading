import http.server
import socketserver
import webbrowser
import os

PORT = 8000
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

class MyHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

def run_server():
    # Force socket reuse to avoid "address already in use" errors on restarts
    socketserver.TCPServer.allow_reuse_address = True
    
    with socketserver.TCPServer(("", PORT), MyHTTPRequestHandler) as httpd:
        print(f"\n==================================================")
        print(f"   NEDUS TRADING LOCAL DEV SERVER ACTIVE")
        print(f"==================================================")
        print(f"Serving files from: {DIRECTORY}")
        print(f"Local Address: http://localhost:{PORT}")
        print(f"Press Ctrl+C to stop the server.")
        print(f"==================================================\n")
        
        # Open in default browser
        webbrowser.open(f"http://localhost:{PORT}")
        
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nServer stopped. Goodbye!")

if __name__ == "__main__":
    run_server()
