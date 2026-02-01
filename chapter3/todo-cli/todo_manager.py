import json
import os
from typing import Dict, List, Union


class TodoManager:
    def __init__(self, filename="todos.json"):
        """TodoManager 인스턴스를 초기화합니다."""
        self.filename = filename
        self.todos: List[Dict[str, Union[str, bool]]] = []
        self.load_todos()

    def load_todos(self):
        """파일에서 할일 목록을 불러옵니다."""
        if not os.path.exists(self.filename):
            self.todos = []
            return

        try:
            with open(self.filename, "r", encoding="utf-8") as f:
                self.todos = json.load(f)
        except (json.JSONDecodeError, IOError):
            self.todos = []

    def save_todos(self):
        """할일 목록을 파일에 저장합니다."""
        try:
            with open(self.filename, "w", encoding="utf-8") as f:
                json.dump(self.todos, f, ensure_ascii=False, indent=2)
        except IOError as e:
            print(f"Error saving todos: {e}")

    def add_todo(self, task: str):
        """새로운 할일을 추가합니다."""
        self.todos.append({"task": task, "completed": False})
        self.save_todos()

    def list_todos(self) -> List[Dict[str, Union[str, bool]]]:
        """모든 할일 목록을 반환합니다."""
        return self.todos

    def complete_todo(self, index: int) -> bool:
        """지정된 인덱스의 할일을 완료 처리합니다."""
        if 0 <= index < len(self.todos):
            self.todos[index]["completed"] = True
            self.save_todos()
            return True
        return False

    def delete_todo(self, index: int) -> bool:
        """지정된 인덱스의 할일을 삭제합니다."""
        if 0 <= index < len(self.todos):
            self.todos.pop(index)
            self.save_todos()
            return True
        return False

    def search_todos(self, keyword):
        """키워드로 할일 검색"""
        return [todo for todo in self.todos if keyword.lower() in todo["task"].lower()]

    def set_priority(self, index: int, priority: str) -> bool:
        """할일의 우선순위를 설정합니다."""
        if 0 <= index < len(self.todos) and priority in ["상", "중", "하"]:
            self.todos[index]["priority"] = priority
            self.save_todos()
            return True
        return False

    def get_all_todos(self):
        """파일에서 모든 할일을 직접 읽어옵니다."""
        with open("todos.json", "r") as f:
            return json.load(f)
