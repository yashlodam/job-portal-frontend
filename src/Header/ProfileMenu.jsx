import React, { useState } from "react";
import { Menu, Button, Avatar, Switch } from "@mantine/core";
import {
  IconUserCircle,
  IconMessageCircle,
  IconFileText,
  IconMoon,
  IconSun,
  IconArrowsLeftRight,
  IconTrash,
  IconSettings,
  IconLogout2,
} from "@tabler/icons-react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { removeUser } from "../Slices/UserSlice";

function ProfileMenu() {
    const USER = { name: "Marshal", role: "Software Engineer" };
    const user = useSelector((store)=> store.user);

    const [checked,setChecked] = useState(false);
    const [opened,setOpened] = useState(false)

    const dispatch = useDispatch();
    console.log(user);


    const handleLogout = ()=>{

      dispatch(removeUser())

    }

  return (
    <Menu
      opened={opened}
      onChange={setOpened}
      shadow="xl"
      width={250}
      position="bottom-end"
      withArrow
      arrowPosition="center"
    >
      <Menu.Target>
        <Button
          variant="subtle"
          p={0}
          className="rounded-full hover:bg-white/5"
        >
         <Button
      variant="subtle"
      p={0}
      className="rounded-2xl"
    >

      <div className="flex items-center gap-3 rounded-2xl px-3 py-2 hover:bg-white/5">

        <Avatar
          src="/avatar.jpg"
          radius="xl"
          size={42}
        >
          Y
        </Avatar>

        <div className="text-left">

          <p className="text-sm font-semibold text-white">
            {user.name}
          </p>

          <p className="text-xs text-slate-400">
            {user.role}
          </p>

        </div>

      </div>

    </Button>


        </Button>
      </Menu.Target>

      <Menu.Dropdown onChange={()=> setOpened(true)} className="!bg-slate-900 !border !border-white/10 rounded-xl">

        <Link to="/profiles">
        <Menu.Item
         color="white"
          leftSection={<IconUserCircle size={18} />}
        >
          My Profile
        </Menu.Item>
        </Link>

        <Menu.Item
          color="white"
          leftSection={<IconMessageCircle size={18} />}
        >
          Messages
        </Menu.Item>

        <Menu.Item
          color="white"
          leftSection={<IconFileText size={18} />}
        >
          My Resume
        </Menu.Item>

        <Menu.Divider />

        <Menu.Item
          color="white"
          leftSection={<IconMoon size={18} />}
          rightSection={
            <Switch
              checked={checked}
              onChange={(event)=> setChecked(event.currentTarget.checked)}
              size="sm"
              color="cyan"
              onLabel={<IconSun size={12} />}
              offLabel={<IconMoon size={12} />}
            />
          }
        >
          Dark Mode
        </Menu.Item>

        <Menu.Divider />

        <Menu.Item
        onClick={handleLogout}
          color="red"
          leftSection={<IconLogout2 size={18} />}
        >
          Logout
        </Menu.Item>

      </Menu.Dropdown>
    </Menu>
  );
}

export default ProfileMenu;