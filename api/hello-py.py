def handler(request):
    return {
        "language": "Python",
        "message": "Python serverless function OK",
        "time": __import__("datetime").datetime.utcnow().isoformat()
    }
