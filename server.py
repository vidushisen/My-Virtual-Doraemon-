"""
Doraemon Language Adventure - Local Web Server
22nd Century Academy Launcher
"""
import http.server
import socketserver
import webbrowser
import os
import sys

PORT = 8888
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

def run():
    os.chdir(DIRECTORY)
    print(f"==================================================")
    print(f"🐱 DORAEMON'S 22nd CENTURY LANGUAGE ACADEMY 🐱")
    print(f"==================================================")
    print(f"Serving files from: {DIRECTORY}")
    print(f"Opening browser at: http://localhost:{PORT}")
    print(f"Press Ctrl+C in terminal to stop server.")
    print(f"==================================================")

    # Open default browser automatically
    webbrowser.open(f"http://localhost:{PORT}")

    with socketserver.TCPServer(("", PORT), Handler) as httpd:
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nShutting down Doraemon Academy server. Sayounara! 👋")
            sys.exit(0)

if __name__ == "__main__":
    run()
