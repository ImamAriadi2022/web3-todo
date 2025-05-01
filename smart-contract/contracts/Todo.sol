// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Todo {
    struct Task {
        uint id;
        string content;
        bool completed;
    }

    mapping(address => Task[]) public userTasks;

    function addTask(string memory _content) public {
        uint taskId = userTasks[msg.sender].length;
        userTasks[msg.sender].push(Task(taskId, _content, false));
    }

    function toggleTask(uint _id) public {
        require(_id < userTasks[msg.sender].length, "Invalid ID");
        userTasks[msg.sender][_id].completed = !userTasks[msg.sender][_id].completed;
    }

    function getTasks() public view returns (Task[] memory) {
        return userTasks[msg.sender];
    }
}
