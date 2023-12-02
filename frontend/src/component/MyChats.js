import React, { useEffect, useState } from 'react'
import { ChatState } from "../Context/ChatProvider";
import { Box, Button, Stack, Text, useToast } from '@chakra-ui/react';
import axios from 'axios';
import "./MyChat.css"
import { AddIcon } from '@chakra-ui/icons';
import ChatLoading from "./ChatLoading";
import { getSender } from '../Config/ChatLogic';
import GroupChatModal from "./miscellaneous/GroupChatModal"

const MyChats = ({fetchAgain}) => {
  const [loggedUser, setLoggedUser] = useState()
  const { user, selectedChat,setSelectedChat, chats, setChats } = ChatState();

  const toast = useToast();

  const fetchChats = async()=>{
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`, 
        }
      };
      console.log("1")
      const { data } = await axios.get("/api/chat", config);
      console.log(data)
      setChats(data)
    } catch (error) {
      toast({
        title: "Error occured!",
        description: "Failed to Load the chats",
        status: "error",
        duration:5000,
        isClosable: true,
        position: "bottom-centre",
      })
    }
  }

  useEffect(()=>{
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
  }, [fetchAgain])

  return (
    <Box
      display={{base: selectedChat ? "none" : "flex", md: "flex"}}
      w={{base: "100%", md: "35%", lg:"31%"}}
      className='mcha' 
    >
      <Box className='chahead'>
        My Chats
        <GroupChatModal>
        <Button
          display="flex"
          fontSize={{base: "17px", md: "10px", lg: "17px"}}
          rightIcon={<AddIcon/>}
        >
         New Group
        </Button>
        </GroupChatModal>
      </Box>
      <Box className='chabod'>
        {chats ? (
          <Stack overflow="scroll">
            {chats.map((chat)=>(
              <Box
                onClick={()=> setSelectedChat(chat)}
                className='chaLis'
                bg={selectedChat === chat ? "#38B2AC" : "#E8E8E8"}
                color={selectedChat === chat ? "white" : "bkack"}
                key={chat.id}
              >
                <Text>
                  {!chat.isGroupChat ? getSender(loggedUser, chat.users) : chat.chatName}
                </Text>
              </Box>
           ))}
          </Stack>
        ):(
          <ChatLoading/>
        )}
      </Box>
    </Box>
  )
}

export default MyChats