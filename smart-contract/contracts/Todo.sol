// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract Todo {
    struct Task {
        uint id;
        string content;
        bool completed;
    }

    mapping(address => Task[]) public userTasks;

    uint public taskFee = 0.01 ether; // Biaya untuk menambahkan task

    function addTask(string memory _content) public payable {
        require(msg.value >= taskFee, "Not enough ETH sent");
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