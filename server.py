import http.server
import socketserver
import os
import sys
import webbrowser

PORT = 8080
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def log_message(self, format, *args):
        # Concise logging
        sys.stderr.write(f"[Velmora Server] {args[0]} - {args[1]}\n")

def start_server():
    os.chdir(DIRECTORY)
    # Find open port if 8080 is busy
    port = PORT
    for p in range(PORT, PORT + 20):
        try:
            with socketserver.TCPServer(("", p), Handler) as httpd:
                print(f"Velmora Store running at: http://localhost:{p}")
                # Attempt to open browser automatically
                try:
                    webbrowser.open(f"http://localhost:{p}")
                except Exception:
                    pass
                httpd.serve_forever()
                break
        except OSError:
            continue

if __name__ == "__main__":
    start_server()
