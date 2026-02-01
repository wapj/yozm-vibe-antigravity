import os
import sys
import unittest

# Add directory to path to import todo_manager
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from todo_manager import TodoManager


class TestTodoManager(unittest.TestCase):
    def setUp(self):
        self.test_file = "test_todos.json"
        # Ensure clean state
        if os.path.exists(self.test_file):
            os.remove(self.test_file)
        self.manager = TodoManager(self.test_file)

    def tearDown(self):
        if os.path.exists(self.test_file):
            os.remove(self.test_file)

    def test_add_and_list(self):
        self.manager.add_todo("Test Task")
        todos = self.manager.list_todos()
        self.assertEqual(len(todos), 1)
        self.assertEqual(todos[0]["task"], "Test Task")
        self.assertFalse(todos[0]["completed"])

    def test_complete(self):
        self.manager.add_todo("To Complete")
        self.manager.complete_todo(0)
        self.assertTrue(self.manager.todos[0]["completed"])

    def test_delete(self):
        self.manager.add_todo("To Delete")
        self.manager.delete_todo(0)
        self.assertEqual(len(self.manager.todos), 0)

    def test_persistence(self):
        self.manager.add_todo("Persistent Task")

        # Create new manager instance to verify loading
        new_manager = TodoManager(self.test_file)
        todos = new_manager.list_todos()
        self.assertEqual(len(todos), 1)
        self.assertEqual(todos[0]["task"], "Persistent Task")


if __name__ == "__main__":
    unittest.main()
