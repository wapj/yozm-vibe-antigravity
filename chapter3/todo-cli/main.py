import os
import sys

# Ensure we can import todo_manager
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from todo_manager import TodoManager


def main():
    base_dir = os.path.dirname(os.path.abspath(__file__))
    json_path = os.path.join(base_dir, "todos.json")
    manager = TodoManager(json_path)

    while True:
        print("\n--- 할일 관리 CLI ---")
        print("1. 할일 추가")
        print("2. 목록 보기")
        print("3. 완료 처리")
        print("4. 삭제")
        print("5. 종료")

        try:
            choice = input("선택: ")
        except EOFError:
            print("\n프로그램을 종료합니다.")
            break

        if choice == "1":
            task = input("할일 내용: ")
            manager.add_todo(task)
            print("할일이 추가되었습니다.")
        elif choice == "2":
            todos = manager.list_todos()
            print("\n[할일 목록]")
            if not todos:
                print("할일이 없습니다.")
            for i, todo in enumerate(todos):
                status = "[x]" if todo["completed"] else "[ ]"
                print(f"{i}. {status} {todo['task']}")
        elif choice == "3":
            try:
                index = int(input("완료할 할일 번호: "))
                if manager.complete_todo(index):
                    print("완료 처리되었습니다.")
                else:
                    print("잘못된 번호입니다.")
            except ValueError:
                print("숫자를 입력해주세요.")
        elif choice == "4":
            try:
                index = int(input("삭제할 할일 번호: "))
                if manager.delete_todo(index):
                    print("삭제되었습니다.")
                else:
                    print("잘못된 번호입니다.")
            except ValueError:
                print("숫자를 입력해주세요.")
        elif choice == "5":
            print("프로그램을 종료합니다.")
            break
        else:
            print("잘못된 선택입니다.")


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n프로그램을 종료합니다.")
