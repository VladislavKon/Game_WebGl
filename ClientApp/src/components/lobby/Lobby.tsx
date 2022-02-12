import * as React from 'react';
import Box from '@mui/material/Box';
import { Link } from 'react-router-dom';
import { useAppSelector } from '../../app/hooks';
import { Button, Collapse, Container, CssBaseline, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, List, ListItem, ListItemButton, ListItemIcon, ListItemText, ListSubheader, TextField, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import PersonIcon from '@mui/icons-material/Person';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { ITeam, IUser } from '../../shared/Data/DataTypes';
import ReusedList from '../../shared/components/ReusedList';
import TeamItem from './TeamItem';
import { useEffect, useState } from 'react';
import axios from 'axios';

const Demo = styled('div')(({ theme }) => ({
    backgroundColor: theme.palette.background.paper,
}));

function generate(element: React.ReactElement) {
    return [0, 1, 2].map((value) =>
        React.cloneElement(element, {
            key: value,
        }),
    );
}

export default function Lobby() {
    const userName = useAppSelector(s => s.auth.name)
    const [chatMessages, setChatMessages] = useState();

    const [selectedTeam, setSelectedTeam] = useState(0);
    const [openCreateTeamForm, setOpenCreateTeamForm] = useState<boolean>(false);
    const [teams, setTeams] = useState<ITeam[]>([]);


    useEffect(() => {
        fetchTeams();
    }, [])

    const handleClickOpenCreateTeamForm = () => {
        setOpenCreateTeamForm(true);
    }

    const handleClickCloseCreateTeamForm = () => {
        setOpenCreateTeamForm(false);
    }

    const handleListIndexClick = (selectedTeamIndex: number) => {
        setSelectedTeam(selectedTeamIndex);
    };

    const handleCreateFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        console.log({
            teamName: data.get('teamNameField')
        });
        const body = {
            TeamName: data.get('teamNameField')
        };

        const response = await axios.post('api/team/teamregister', body)
            .then(function (response) {
                fetchTeams();
            })
            .catch(function (error) {
                console.log(error);
            });

        handleClickCloseCreateTeamForm();
    }

    async function fetchTeams() {
        try {
            const response = await axios.get<ITeam[]>('api/team/getallteams')
            setTeams(response.data);
        }
        catch (e) {
            console.log(e);
        }
    }

    async function joinToTheTeam(teamId: number) {
        const body = {
            teamId: teamId
        }
        const response = await axios.post('api/team/jointheteam', body)
            .then(function () {
                fetchTeams();
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    return (
        <Container maxWidth="xl">
            <CssBaseline />
            <Box sx={{
                bgcolor: '#cfe8fc',
                display: 'flex',
                height: '100vh',
                flexDirection: 'column'
            }}>
                <Box sx={{
                    display: "block",
                    bgcolor: 'primary.main',
                    height: '10%',
                    mb: '10px'
                }}
                >Header</Box>
                <Box className="contentMiddle"
                    sx={{
                        height: '80%',
                        display: 'flex'
                    }}
                >
                    <Box className="chatBlock"
                        sx={{
                            flexGrow: 1,
                            bgcolor: '#98bf93'
                        }}>
                        Chat Block
                    </Box>
                    <Box className="teamsBlock"
                        sx={{
                            flexGrow: 2,
                            bgcolor: '#fff',
                            display: 'flex',
                            flexDirection: 'column'
                        }}>
                        <Box sx={{ flexGrow: 1, bgcolor: '#c1c7b7' }}></Box>
                        <Box sx={{ flexGrow: 10, bgcolor: '#fff' }}>
                            <ReusedList items={teams} renderItem={(team: ITeam) =>
                                <TeamItem selectedIndex={selectedTeam} onClickListItem={(selectedTeam) => handleListIndexClick(selectedTeam)} team={team} users={team.users} key={team.id} />
                            }
                            />
                        </Box>
                        <Box sx={{
                            flexGrow: 1, bgcolor: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'flex-end'
                        }}>
                            <Button variant="outlined" sx={{ mr: 1, ml: 1 }}
                                onClick={() => joinToTheTeam(selectedTeam)} >Присоедениться</Button>
                            <Button variant="outlined" sx={{ mr: 1, ml: 1 }} onClick={handleClickOpenCreateTeamForm}>Создать</Button>
                            <Dialog open={openCreateTeamForm} onClose={handleClickCloseCreateTeamForm}>
                                <Box component="form" onSubmit={handleCreateFormSubmit}>
                                    <DialogTitle>Создать команду</DialogTitle>
                                    <DialogContent>
                                        <TextField
                                            autoFocus
                                            name="teamNameField"
                                            margin="dense"
                                            id="teamNameField"
                                            label="Введите название команды"
                                            type="text"
                                            fullWidth
                                            variant="outlined"
                                        />
                                    </DialogContent>
                                    <DialogActions>
                                        <Button onClick={handleClickCloseCreateTeamForm}>Отмена</Button>
                                        <Button type="submit">Подтвердить</Button>
                                    </DialogActions>
                                </Box>
                            </Dialog>
                        </Box>
                    </Box>

                </Box>
                <Box className="contentFooter" sx={{ height: '10%', bgcolor: '#57535c' }}
                >Footer Content</Box>
            </Box>
        </Container>
    );
}
