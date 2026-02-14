import socket
import sys

def check_broker(host, port):
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        s.settimeout(2)
        result = s.connect_ex((host, port))
        if result == 0:
            print(f"SUCCESS: Connected to {host}:{port}")
            sys.exit(0)
        else:
            print(f"FAILURE: Could not connect to {host}:{port} (Error Code: {result})")
            sys.exit(1)
    except Exception as e:
        print(f"ERROR: {e}")
        sys.exit(1)

if __name__ == "__main__":
    check_broker("192.168.137.128", 1883)
