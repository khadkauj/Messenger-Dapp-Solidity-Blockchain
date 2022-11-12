// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

/** 
 * @title Ballot
 * @dev Implements voting process along with vote delegation
 */
contract Mess {

      struct Message {
        uint id; // weight is accumulated by delegation
        address sender; // person delegated to
        address receiver;
        string messageText;
    }

    struct User {
        uint id;
        address userAddress;
    }

    Message[] messageList;
    User[] userList;
    // mapping(address => bool) public userAddress;

    // add user
    function addUser() external {
        // userAddress[msg.sender] = true;
        uint id = userList.length;
        userList.push(User(id, msg.sender));
    }
    // get all users
    function getUser() external view returns(User[] memory ){
        return userList;
    }
    // add message
    function addMessage(address receiver, string memory messageText) external {
        uint id = messageList.length;
        messageList.push(Message(id, msg.sender, receiver, messageText));
    } 
    // get message
    function getMessage(address receiver) external view returns ( Message[] memory) {
        Message[] memory temporary = new Message[](messageList.length);
        uint counter = 0;
        for(uint i = 0; i < messageList.length; i++){
            if((messageList[i].sender == msg.sender && messageList[i].receiver == receiver) ||
             (messageList[i].receiver == msg.sender && messageList[i].sender == receiver) ){
                 temporary[counter] = messageList[i];
                 counter++;
             }
        }

        Message[] memory result = new Message[](counter);
        for(uint i = 0; i < counter; i++){
            result[i] = temporary[i];
        }

        return result;
    }


}