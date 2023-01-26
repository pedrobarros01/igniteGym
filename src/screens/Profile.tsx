import { ScreenHeader } from "@components/ScreenHeader";
import { UserPhoto } from "@components/UserPhoto";
import {Alert, TouchableOpacity} from "react-native"
import { VStack, Text, ScrollView, Center, Skeleton, Heading, useToast } from "native-base";
import React from "react";
import { Input } from "@components/Input";
import { Button } from "@components/Button";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";

const PHOTO_SIZE = 33;




export function Profile(){
    const [photoIsLoading, setPhotoIsLoading] = React.useState(false);
    const [userPhoto, setUserPhoto] = React.useState('https://github.com/pedrobarros01.png');
    const toast = useToast();
    async function handleUserPhotoSeelect(){
        setPhotoIsLoading(true);
        try{
            const photoSelected = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                quality: 1,
                aspect: [4, 4],
                allowsEditing: true,
    
            });
            if(photoSelected.canceled){
                return;
            }
            if(photoSelected.assets[0].uri){
                const photoInfo = await FileSystem.getInfoAsync(photoSelected.assets[0].uri);
                if(photoInfo.size && (photoInfo.size / 1024 / 1024) > 5){
                    return toast.show({
                        title: 'Essa imagem é muito grande. Escolha uma de até 5MB',
                        placement: 'top',
                        bgColor: 'red.500'
                    });
                    
                    //return Alert.alert("Essa imagem é muito grande. Escolha uma de até 5MB");
                }
                setUserPhoto(photoSelected.assets[0].uri);
            }
        }catch(error){
            console.log(error);
        }finally{
            setPhotoIsLoading(false);
        }


        
    }

    return(
        <VStack flex={1}>
            <ScreenHeader title="Perfil" />
            <ScrollView>
                <Center mt={6} px={10}>
                    {
                    photoIsLoading ?
                        <Skeleton 
                    h={PHOTO_SIZE}
                    w={PHOTO_SIZE}
                    rounded="full"
                    startColor="gray.500"
                    endColor="gray.400"
                    />
                    :
                    <UserPhoto 
                    source={{uri: userPhoto}}
                    alt="Foto do usuário"
                    size={PHOTO_SIZE}
                    />
                    }
                    <TouchableOpacity onPress={handleUserPhotoSeelect}>
                        <Text color="green.500" fontWeight="bold" fontSize="md" mt={2} mb={8}>
                            Alterar foto
                        </Text>
                    </TouchableOpacity>

                    <Input 
                    placeholder="Nome"
                    bg="gray.600"
                    />
                    <Input 
                    placeholder="Email"
                    bg="gray.600"
                    isDisabled
                    />
                </Center>
                <VStack px={10} mt={12} mb={9}>
                    <Heading color="gray.200" fontSize="md" fontFamily="heading" mb={2}>
                        Alterar senha
                    </Heading>
                    <Input 
                    bg="gray.600"
                    placeholder="Senha antiga"
                    secureTextEntry
                    />
                    <Input 
                    bg="gray.600"
                    placeholder="Nova senha"
                    secureTextEntry
                    />
                    <Input 
                    bg="gray.600"
                    placeholder="Confirme nova senha"
                    secureTextEntry
                    />

                    <Button 
                    title="Atualizar"
                    mt={4}
                    />
                </VStack>
            </ScrollView>
        </VStack>
    );
}