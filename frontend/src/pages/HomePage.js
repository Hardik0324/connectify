import React, { useEffect } from "react";
import { Container, Box, Text, Tabs, TabList, Tab, TabPanels, TabPanel } from "@chakra-ui/react";
import "./HomePage.css";
import Login from "../component/authentication/Login";
import Signup from "../component/authentication/Signup";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const Navigate = useNavigate();

  useEffect(()=>{
    console.log(localStorage.getItem("userInfo"))
    const user = JSON.parse(localStorage.getItem("userInfo"));
    console.log(user)

    if (user) {
      Navigate("/chats");
    }
  }, [Navigate])

  return (
    <Container maxW="xl" centerContent>
      <Box className="header">
        <Text className="header-Text">CONNECTIFY</Text>
      </Box>
      <Box className="form">
        <Tabs isFitted variant="soft-rounded" className="tabs">
          <TabList className="List">
            <Tab>Login</Tab>
            <Tab>Sign Up</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Login />
            </TabPanel>
            <TabPanel>
              <Signup />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  );
};

export default HomePage;
