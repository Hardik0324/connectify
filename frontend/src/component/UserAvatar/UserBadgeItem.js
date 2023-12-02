import { CloseIcon } from '@chakra-ui/icons'
import { Box } from '@chakra-ui/react'
import React from 'react'
import "./UserBadgeItem.css"

const UserBadgeItem = ({user, handleFunction}) => {
  return (
    <Box className="badge" variant="solid">
      {user.name}
      <CloseIcon pl={1} onClick={handleFunction} />
    </Box>
  );
}

export default UserBadgeItem