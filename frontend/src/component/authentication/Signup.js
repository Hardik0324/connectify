import {
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  VStack,
  useToast,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Signup = () => {
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [ConfirmPassword, setConfirmPassword] = useState();
  const [pic, setPic] = useState();
  const [show, setShow] = useState(false);
  const [show1, setShow1] = useState(false);
  const [loading, setLoading] = useState(false)
  const toast = useToast();
  const navigate = useNavigate()

  const handleClick = () => setShow(!show);
  const handleClick1 = () => setShow1(!show1);

  const picfun = (e) => {
      const reader = new FileReader();

      reader.onload = () => {
        if (reader.readyState === 2) {
          setPic(reader.result);
        }
      };
      reader.readAsDataURL(e.target.files[0]);
  }

  const submitHandler = async() => {
    try {
      setLoading(true);
      if (!name || !password || !email || !ConfirmPassword) {
        toast({
          title: "Please fill all fields",
          status: "warning",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
        setLoading(false);
        return;
      }
      if (password !== ConfirmPassword) {
        toast({
          title: "Passwords do not match",
          status: "warning",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
        setLoading(false);
        return;
      }
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };
      // console.log("1")
      const { data } = await axios.post(
        "/api/users",
        { name, email, password, pic },
        config
      );
      // console.log("2")
      localStorage.setItem("userInfo", data);
      setLoading(false);
      navigate("/chats");
    } catch (error) {
      toast({
        title: "Error Occured",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    }
  }

  return (
    <VStack spacing="5px">
      <FormControl id="firstName" isRequired>
        <FormLabel>Name</FormLabel>
        <Input
          placeholder="Enter Your Name"
          onChange={(e) => {
            setName(e.target.value);
          }}
        />
      </FormControl>
      <FormControl id="Email" isRequired>
        <FormLabel>Email</FormLabel>
        <Input
          placeholder="Enter Your Email"
          onChange={(e) => {
            setEmail(e.target.value);
          }}
        />
      </FormControl>
      <FormControl id="password" isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup>
          <Input
            type={show ? "text" : "password"}
            placeholder="Enter Your Password"
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={handleClick}>
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <FormControl id="confirmPassword" isRequired>
        <FormLabel>Confirm Password</FormLabel>
        <InputGroup>
          <Input
            type={show1 ? "text" : "password"}
            placeholder="Enter Your Password Again"
            onChange={(e) => {
              setConfirmPassword(e.target.value);
            }}
          />
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={handleClick1}>
              {show1 ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <FormControl id="Pics">
        <FormLabel>Upload Your Picture</FormLabel>
        <Input
          type="file"
          p={1.5}
          accept="image/*"
          onChange={
            picfun
          }
        />
      </FormControl>
      <Button
        colorScheme="blue"
        width="100%"
        style={{ marginTop: 15 }}
        onClick={submitHandler}
        isLoading={loading}
      >
        Signup
      </Button>
    </VStack>
  );
};

export default Signup;
