import { ExerciseCard } from "@components/ExerciseCard";
import { Group } from "@components/Group";
import { HomeHeader } from "@components/HomeHeader";
import { useNavigation } from "@react-navigation/native";
import { AppNavigatorRoutesProps } from "@routes/app.routes";
import { VStack, Text, HStack, FlatList, Heading } from "native-base";
import {useState} from "react";
export function  Home(){
    const [groupSelected, setGrouSelected] = useState("costa");
    const [groups, setGrous] = useState(['costa', 'Bíceps', 'Tríceps','ombro']);
    const [exercises, setExercises] = useState(['Puxada frontal', 'Remada curvada', 'Remada unilateral','Levantamento terra']);
    const navigation = useNavigation<AppNavigatorRoutesProps>();
    function handleOpenExerciseDetails(){
        navigation.navigate("exercise");
    }

    return(
        <VStack flex={1}>
            <HomeHeader />
            <FlatList 
            data={groups}
            keyExtractor={item => item}
            renderItem={({item}) => (
                <Group 
                    name={item}
                    isActive={groupSelected === item}
                    onPress={() => setGrouSelected(item)}
                />
            )}
            horizontal
            showsHorizontalScrollIndicator={false}
            _contentContainerStyle={{px: 8}}
            my={10}
            maxH={10}
            minH={10}
            />
            <VStack flex={1} px={8}>
                <HStack justifyContent="space-between" mb={5}>
                    <Heading color="gray.200" fontSize="md" fontFamily="heading" >Exercícios</Heading>
                    <Text color="gray.200" fontSize="sm">{exercises.length}</Text>
                </HStack>



                <FlatList
                data={exercises}
                keyExtractor={item => item}
                renderItem={({item}) => (
                    <ExerciseCard 
                    onPress={handleOpenExerciseDetails}
                    />
                )}
                showsVerticalScrollIndicator={false}
                _contentContainerStyle={{paddingBottom: 20}}
                />
            </VStack> 
        </VStack>
    );
}