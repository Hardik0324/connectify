import { ViewIcon } from '@chakra-ui/icons';
import { Box, Button, FormControl, IconButton, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Spinner, useDisclosure, useToast } from '@chakra-ui/react';
import React, { useState } from 'react'
import { ChatState } from '../../Context/ChatProvider';
import "./UpdateGroupChatModal.css"
import UserBadgeItem from '../UserAvatar/UserBadgeItem';
import axios from 'axios';
import UserListItem from '../UserAvatar/UserListItem';

const UpdateGroupChatModal = ({fetchAgain, setFetchAgain, fetchMessages}) => {
const { isOpen, onOpen, onClose } = useDisclosure();
const [groupChatName, setGroupChatName] = useState();
const [search, setSearch] = useState();
const [searchResult, setSearchResult] = useState([]);
const [loading, setLoading] = useState(false);
const [renameLoading, setRenameLoading] = useState(false);

const toast = useToast()

const {selectedChat, setSelectedChat, user} = ChatState();

const handleRemove = async(user1) =>{
  if (selectedChat.groupAdmin._id !== user._id && user1._id !== user._id){
    toast({
      title: "Only admins can add someone!",
      status: "error",
      duration: 5000,
      isClosable: true,
      position: "bottom-centre",
    });
    return;
  }

  try {
    setLoading(true)
    const config = {
      headers: {
        Authorization: `Bearer ${user.token}`,
      }
    }
    const {data} = await axios.put(
      `/api/chat/groupremove`,
      {
        chatId: selectedChat._id,
        userId: user1._id
      }, 
      config
    )
    user1._id === user._id ? setSelectedChat() : setSelectedChat(data);
    setFetchAgain(!fetchAgain);
    fetchMessages();
    setLoading(false);
  } catch (error) {
     toast({
       title: "Error occured!",
       description: error.response.data.message,
       status: "error",
       duration: 5000,
       isClosable: true,
       position: "bottom-centre",
     });
     setLoading(false);
  }
  }

const handleAddUser = async(user1) =>{
  if(selectedChat.users.find((u)=> u._id === user1._id)){
    toast({
      title: "User already in group!",
      status: "error",
      duration: 5000,
      isClosable: true,
      position: "bottom-centre",
    });
    return;
  }

  if(selectedChat.groupAdmin._id !== user._id){
    toast({
      title: "Only admins can add someone!",
      status: "error",
      duration: 5000,
      isClosable: true,
      position: "bottom-centre",
    });
    return;
  }

  try {
    setLoading(true)

    const config = {
      headers: {
        Authorization : `Bearer ${user.token}`
      },
    }

    const {data} = await axios.put('/api/chat/groupadd',{
      chatId: selectedChat._id,
      userId: user1._id
    },
    config
    )
    setSelectedChat(data);
    setFetchAgain(!fetchAgain);
    setLoading(false)
  } catch (error) {
     toast({
       title: "Error occured!",
       description: error.response.data.message,
       status: "error",
       duration: 5000,
       isClosable: true,
       position: "bottom-centre",
     });
     setLoading(false);
  }
}

const handleRename = async() =>{
    if(!groupChatName){
        return
    }
    try {
        setRenameLoading(true);

        const config = {
            headers:{
                Authorization: `Bearer ${user.token}`
            }
        }
        const { data } = await axios.put("/api/chat/rename", {
          chatId: selectedChat._id,
          chatName: groupChatName
          },
          config
        );
        console.log(data)
        setSelectedChat(data)
        setFetchAgain(!fetchAgain);
        setRenameLoading(false)
    } catch (error) {
        toast({
          title: "Error occured!",
          description: error.response.data.message,
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom-centre",
        });
        setRenameLoading(false)
    }
    setGroupChatName("")
}

const handleSearch = async(que) =>{
      console.log(que)
      setSearch(que)
      if(!que){
        return
      }
      try {
        setLoading(true)
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`
          }
        }
        console.log(search)
        const {data} = await axios.get(`/api/users?search=${search}`, config)
        console.log(data+"...");
        setLoading(false)
        setSearchResult(data)
      } catch (error) {
        toast({
          title: "Error occured!",
          description: "Failed to Load the search result",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom-centre",
        });
      }
}

return (
  <>
    <IconButton
      display={{ base: "flex" }}
      icon={<ViewIcon />}
      onClick={onOpen}
    />

    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader className="modhead">{selectedChat.chatName}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Box w="100%" display="flex" flexWrap="wrap" pb="3">
            {selectedChat.users.map((u) => (
              <UserBadgeItem
                key={user._id}
                user={u}
                handleFunction={() => handleRemove(u)}
              />
            ))}
          </Box>
          <FormControl display="flex">
            <Input
              placeholder="Group Name"
              mb={3}
              value={groupChatName}
              onChange={(e) => setGroupChatName(e.target.value)}
            />
            <Button
              variant="solid"
              colorScheme="teal"
              ml={1}
              isLoading={renameLoading}
              onClick={handleRename}
            >
              Update
            </Button>
          </FormControl>
          <FormControl>
            <Input
              placeholder="Add user"
              mb={1}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </FormControl>
          {
            loading ? (<Spinner size="lg" />) :
            (
                searchResult?.map((user)=>(
                  <UserListItem
                    key={user._id}
                    user={user}
                    handleFunction={()=>handleAddUser(user)}
                  />
                ))
            )
          }
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="red" mr={3} onClick={()=>handleRemove(user)}>
                Leave Group
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  </>
);
}

export default UpdateGroupChatModal