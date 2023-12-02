import React, { useEffect, useState } from 'react';
import { ChatState } from "../Context/ChatProvider"
import { Box, Center, FormControl, IconButton, Input, Spinner, Text, useToast } from '@chakra-ui/react';
import { ArrowBackIcon } from '@chakra-ui/icons';
import { getSender, getSenderFull } from '../Config/ChatLogic';
import ProfileModal from "./miscellaneous/ProfileModal"
import UpdateGroupChatModal from './miscellaneous/UpdateGroupChatModal';
import axios from 'axios';
import ScrollableChat from './ScrollableChat';
import io from 'socket.io-client'
import { useDragControls } from 'framer-motion';
import Lottie from "lottie-react";
import animationData from "../animations/typing.json"

const ENDPOINT = "http://localhost:5000";
var socket, selectedChatCompare;

const SingleChat = ({fetchAgain, setFetchAgain}) => {

  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)
  const [newMessage, setNewMessage] = useState()
  const [socketConnected, setSocketConnected] = useState(false)
  const [typing, setTyping] = useState(false)
  const [isTyping, setIsTyping] = useState(false);
  

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    }
  }

  const toast = useToast()

  const {user, selectedChat, setSelectedChat, notification, setNotification} = ChatState();

  const fetchMessages = async ()=>{
    if(!selectedChat)
    return;

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`
        },
      }

      setLoading(true);

      const {data} = await axios.get(
        `/api/message/${selectedChat._id}`,
        config
      )
      console.log(data)
      setMessages(data)
      setLoading(false);

      socket.emit("join chat", selectedChat._id);
    } catch (error) {
      toast({
        title: "Error occured!",
        description: "Failed to load the message",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-centre",
      });
    }
  }

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () => {
      setSocketConnected(true);
    });
    socket.on("typing", ()=>setIsTyping(true))
    socket.on("stop tying", ()=>setIsTyping(false))
  }, []);

  useEffect(()=>{
    fetchMessages();

    selectedChatCompare = selectedChat;
  },[selectedChat])

  useEffect(()=>{
    socket.on("message recieved", (newMessageRecieved)=>{
      if(!selectedChatCompare || selectedChatCompare._id !== newMessageRecieved.chat._id){
         if(!notification.includes(newMessageRecieved)){
            setNotification([newMessageRecieved, ...notification]);
            setFetchAgain(!fetchAgain)
         }
      }
      else{
        setMessages([...messages, newMessageRecieved])
      }
    });
  })


  const sendMessage = async(e)=>{
    console.log(e.key, newMessage);
    if(e.key === "Enter" && newMessage){
      socket.emit("stop typing", selectedChat._id)
      try {
        const config = {
          headers:{
            "Content-type": "application/json",
            Authorization: `Bearer ${user.token}`
          }
        }
        setNewMessage("");
        const {data} = await axios.post("/api/message",
          {
            content: newMessage,
            chatId: selectedChat._id,
          },
          config
        )
        console.log(data)

        socket.emit("new message", data)
        setMessages([...messages, data])
      } catch (error) {
        toast({
          title: "Error occured!",
          description: "Failed to send the message",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom-centre",
        });
      }
    }
  }

  const typingHandler = (e)=>{
    // console.log("1")

    setNewMessage(e.target.value)

    if(!socketConnected){
      return
    }
    if(!typing){
      setTyping(true)
      socket.emit("typing", selectedChat._id)
    }

    let lastTypingTime = new Date().getTime();
    var timerLength = 3000;
    setTimeout(()=>{
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;

      if(timeDiff >= timerLength && typing){
        socket.emit("stop typing", selectedChat._id)
        setTyping(false)
      }
    }, timerLength)
  }

  return (
    <>
      {selectedChat ? (
        <>
          <Text
            fontSize={{ base: "28x", md: "30px" }}
            pb={3}
            px={2}
            w="100%"
            fontFamily="work sans"
            display="flex"
            justifyContent={{ base: "space-between" }}
            alignItems="center"
          >
            <IconButton
              display={{ base: "flex", md: "none" }}
              icon={<ArrowBackIcon />}
              onClick={() => setSelectedChat("")}
            />
            {!selectedChat.isGroupChat ? (
              <>
                {getSender(user, selectedChat.users)}
                <ProfileModal user={getSenderFull(user, selectedChat.users)} />
              </>
            ) : (
              <>
                {selectedChat.chatName.toUpperCase()}
                <UpdateGroupChatModal
                fetchAgain={fetchAgain}
                setFetchAgain={setFetchAgain}
                fetchMessages={fetchMessages}
              />
              </>
            )}
          </Text>
          <Box
            display="flex"
            flexDir="column"
            justifyContent="flex-end"
            p={3}
            bg="#E8E8E8"
            w="100%"
            h="100%"
            borderRadius="lg"
            overflowY="hidden"
          >
            {
              loading ? (
                <Spinner
                  size="xl"
                  w={20}
                  h={20}
                  alignSelf="center"
                  margin="auto"
              />) : (
                <Box display="flex" flexDirection="column" overflowY="scroll" className='mess'>
                <ScrollableChat messages={messages}/>
                </Box>
              )
            }
            <FormControl onKeyDown={sendMessage} isRequired mt={3}>
              {isTyping? <div>
                <Lottie
                  options={defaultOptions}
                  width={70}
                  style={{marginBottom: 15, marginLeft: 0}}
                />
              </div> : <></>}
              <Input variant="filled" bg="#D0D0D0" placeholder='Enter a message..' onChange={typingHandler} value={newMessage}/>
            </FormControl>
          </Box>
        </>
      ) : (
        <Box
          display="flex"
          alignItems="centre"
          justifyContent="centre"
          h="100%"
        >
          <Text fontSize="3xl" pb={3} fontFamily="Work sans">
            Click on a user to start chatting
          </Text>
        </Box>
      )}
    </>
  );
}

export default SingleChat