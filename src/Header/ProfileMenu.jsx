import React from 'react'
import { Menu, Button, Text, Avatar, Switch } from '@mantine/core';
import { ChatCircleIcon, GearSixIcon, ImageIcon, MagnifyingGlassIcon, TrashIcon } from '@phosphor-icons/react';
import { IconArrowsLeftRight, IconFileText, IconMoon, IconUserCircle } from '@tabler/icons-react';



function ProfileMenu() {
    return (
        <div>
            <Menu shadow="md" width={200}>
                <Menu.Target>
                    <Button>
                        <Avatar
                            src="/avatar.jpg"
                            radius="xl"
                            size={34}
                            className="ring-2 ring-white/10"
                        >
                            M
                        </Avatar>
                    </Button>
                </Menu.Target>

                <Menu.Dropdown>
                    <Menu.Item leftSection={<IconUserCircle size={14} />}>
                        Profile
                    </Menu.Item>
                    <Menu.Item leftSection={<ChatCircleIcon size={14} />}>
                        Messages
                    </Menu.Item>
                    <Menu.Item leftSection={<IconFileText size={14} />}>
                        Resume
                    </Menu.Item>
                    <Menu.Item
                        leftSection={<IconMoon size={14} />}
                        rightSection={
                            <Switch size='md' color='black'/>
                        }
                    >
                        White Mode
                    </Menu.Item>

                    <Menu.Divider />

                    <Menu.Label>Danger zone</Menu.Label>
                    <Menu.Item
                        leftSection={<IconArrowsLeftRight size={14} />}
                    >
                        Transfer my data
                    </Menu.Item>
                    <Menu.Item
                        color="red"
                        leftSection={<TrashIcon size={14} />}
                    >
                        Delete my account
                    </Menu.Item>
                </Menu.Dropdown>
            </Menu>

        </div>
    )
}

export default ProfileMenu