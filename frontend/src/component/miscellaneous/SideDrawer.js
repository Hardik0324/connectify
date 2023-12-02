import { Box, Button, Tooltip, Text, Menu, MenuButton, Avatar, MenuList, MenuItem, MenuDivider, Drawer, useDisclosure, DrawerOverlay, DrawerContent, DrawerHeader, DrawerBody, DrawerFooter, Input, useToast, Spinner, effect } from "@chakra-ui/react";
import React, { useState } from "react";
import { BellIcon, ChevronDownIcon, SearchIcon } from "@chakra-ui/icons";
import "./SideDrawer.css";
import { ChatState } from "../../Context/ChatProvider";
import ProfileModal from "./ProfileModal";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ChatLoading from "../ChatLoading";
import UserListItem from "../UserAvatar/UserListItem";
import { Effect } from "react-notification-badge";
import NotificationBadge from "react-notification-badge";
import { getSender } from "../../Config/ChatLogic";

const SideDrawer = () => {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState();
  const {
    user,
    setSelectedChat,
    chats,
    setChats, 
    notification,
    setNotification,
  } = ChatState();
  const Navigate = useNavigate()

  const toast = useToast()

  const logoutHandler = ()=>{
    localStorage.removeItem("userInfo");
    Navigate("/")
  }

  const handleSearch = async(e)=>{
    let search1 = e.target.value;
    setSearch(search1)
    if(!search1){
      setSearchResult([]);
      return
    }
    try {
      setLoading(true)
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`, 
        },
      };

      const users = await axios.get(`/api/users?search=${search1}`,
        config
      )
      console.log(users.data)
      setLoading(false)
      setSearchResult(users.data);
      console.log(searchResult)
    } catch (error) {
      toast({
        title: "Error occured!",
        description: "Failed to Load the search result",
        status: "error",
        duration:5000,
        isClosable: true,
        position: "bottom-centre",
      })
    }
  }

  const accessChat = async(userId)=>{
    try {
      setLoadingChat(true)
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`
        },
      }
      const {data} = await axios.post("/api/chat", {userId}, config);
      if(!chats.find((c)=>c._id === data._id))
      setChats([data, ...chats])
      setSelectedChat(data)
      setLoadingChat(false)
      onClose();
    } catch (error) {
      toast({
        title: "Error fetching the chat",
        description: error.message,
        status: "error",
        duration:5000,
        isClosable: true,
        position: "bottom-centre",
      })
    }
  }

  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <>
      <Box className="sidedraw">
        <Tooltip label="Search a User to chat" hasArrow placement="bottom-end">
          <Button variant="ghost" onClick={onOpen}>
            <SearchIcon />
            <Text display={{ base: "none", md: "flex" }} px="4">
              Search User
            </Text>
          </Button>
        </Tooltip>
        <Text fontSize="2xl" fontFamily="Work sans">
          CONNECTIFY
        </Text>
        <div>
          <Menu>
            <MenuButton p="1">
            <NotificationBadge
              count={notification.length}
              effect={Effect.SCALE}
            />
              <BellIcon fontSize="2xl" m="1" />
            </MenuButton>
            <MenuList pl={2}>
              {!notification.length && "No new Message"}{
                notification.map((noti)=>{
                  <MenuItem key={noti._id} onClick={()=>{
                    setSelectedChat(noti.chat);
                    setNotification(notification.filter((n)=> n !== noti));
                  }}>
                    {noti.chat.isGroupChat ? `New Message in ${noti.chat.chatName}`:
                      `New Message from ${getSender(user, noti.chat.users)}`
                    }
                  </MenuItem>
                })
              }
            </MenuList>
          </Menu>
          <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
              <Avatar
                size="sm"
                cursor="pointer"
                name={user.name}
                src={user.pic}
              />
            </MenuButton>
            <MenuList>
              <ProfileModal user={user}>
                <MenuItem>My Profile</MenuItem>
              </ProfileModal>
              <MenuDivider />
              <MenuItem onClick={logoutHandler}>Logout</MenuItem>
            </MenuList>
          </Menu>
        </div>
      </Box>
      <Drawer placement="left" onClick={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth="1px">Search Users</DrawerHeader>
          <DrawerBody>
            <Input
              placeholder="Search by Username"
              mb="2"
              value={search}
              onChange={handleSearch}
            />
            {loading ? <ChatLoading /> : (
              searchResult?.map((user)=>
                <UserListItem
                key={user._id}
                user={user}
                handleFunction={()=>accessChat(user._id)}
                />
              )
            )}
            {loadingChat && <Spinner ml='auto' d='flex'/>}
          </DrawerBody>

          <DrawerFooter>
            <Button variant="outline" mr={3} onClick={onClose}>
              Cancel
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default SideDrawer;
