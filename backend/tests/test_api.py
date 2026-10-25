import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from fastapi.testclient import TestClient
import main

client = TestClient(main.app)

def test_profile_data():
    r = client.get('/api/profile')
    assert r.status_code == 200
    assert r.json()['name'] == 'Sourav Kumar'
    assert len(r.json()['projects']) == 2

def test_health():
    r = client.get('/api/health')
    assert r.status_code == 200
    assert r.json()['status'] == 'ok'

def test_chat_offline(monkeypatch):
    monkeypatch.delenv('GROQ_API_KEY', raising=False)
    r = client.post('/api/chat', json={'question': 'Where has Sourav interned?'})
    assert r.status_code == 200
    assert 'IRDE' in r.json()['answer']
    assert 'Collegedunia' in r.json()['answer']
    assert r.json()['mode'] == 'offline'

def test_unknown_abstains(monkeypatch):
    monkeypatch.delenv('GROQ_API_KEY', raising=False)
    r = client.post('/api/chat', json={'question': 'What is his salary?'})
    assert r.status_code == 200
    assert "don't have enough" in r.json()['answer']

def test_input_validation():
    assert client.post('/api/chat', json={'question': 'a'}).status_code == 422
    assert client.post('/api/chat', json={'question': 'x' * 1001}).status_code == 422

def test_resume_download():
    r = client.get('/api/resume')
    assert r.status_code == 200
    assert r.content.startswith(b'%PDF')

def test_chat_groq_integration_mock(monkeypatch):
    """Exercise the real /api/chat -> Groq adapter without using a key or network."""
    import types
    calls = []
    class FakeCompletions:
        def create(self, **kwargs):
            calls.append(kwargs)
            return types.SimpleNamespace(choices=[types.SimpleNamespace(message=types.SimpleNamespace(content='He interned at IRDE–DRDO and Collegedunia.com.'))])
    class FakeGroq:
        def __init__(self, **kwargs):
            assert kwargs['api_key'] == 'fake-test-key'
            self.chat = types.SimpleNamespace(completions=FakeCompletions())
    monkeypatch.setenv('GROQ_API_KEY', 'fake-test-key')
    monkeypatch.setitem(sys.modules, 'groq', types.SimpleNamespace(Groq=FakeGroq))
    r = client.post('/api/chat', json={'question': 'Where has Sourav interned?'})
    assert r.status_code == 200
    assert r.json()['mode'] == 'groq'
    assert calls[0]['messages'][0]['role'] == 'system'
    assert 'IRDE' in calls[0]['messages'][0]['content']

def test_about_sourav(monkeypatch):
    monkeypatch.delenv('GROQ_API_KEY', raising=False)
    r = client.post('/api/chat', json={'question': 'Tell me about Sourav'})
    assert r.status_code == 200
    assert 'Computer Science' in r.json()['answer']
    assert r.json()['mode'] == 'offline'
