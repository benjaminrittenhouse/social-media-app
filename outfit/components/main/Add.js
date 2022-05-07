
import React, { useState, useEffect } from 'react';
import { Platform, StyleSheet, Text, View, Button, Image} from 'react-native';
import { Camera } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker'


export default function Add({ navigation }) {
  const [hasGalleryPermission, setHasGalleryPermission] = useState(null);
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [camera, setCamera] = useState(null);
  const [image, setImage] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);

  useEffect(() => {
    (async () => {
      // camera access
      const cameraStatus = await Camera.requestCameraPermissionsAsync();
      setHasCameraPermission(cameraStatus.status === 'granted');

      // camera roll / gallery access
      const galleryStatus = await ImagePicker.requestCameraRollPermissionsAsync();
      setHasGalleryPermission(galleryStatus.status === 'granted');

    })();
  }, []);

  const takePicture = async () => {
      // camera exists
      if(camera){ 
          const data = await camera.takePictureAsync(null);
          setImage(data.uri);
      }
  }

  const pickImage = async() => {
      let result = await ImagePicker.launchImageLibraryAsync({
          mediaType: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [1, 1],
          quality: 1,
      });

      if(!result.cancelled){
          setImage(result.uri);
      }
  }

  if (hasCameraPermission === null || hasGalleryPermission === null) {
    return <View />;
  }
  if (hasCameraPermission === false || hasGalleryPermission === false) {
    return <Text>No access to camera</Text>;
  }
  return (
    <View style={{flex: 1}}>
      <View style={ styles.cameraContainer }>
          <Camera 
            ref={ref => setCamera(ref)}
            style={ styles.fixedRatio }
            type={type}
            ratio={ '1:1' }
            />
      </View>
          <Button
            title= "Flip Image"
            style={ {backgroundColor: 'red', fontSize: 100, color: '#eb4034'} }
            onPress={() => {
              setType(
                type === Camera.Constants.Type.back
                  ? Camera.Constants.Type.front
                  : Camera.Constants.Type.back
              );
            }}
            
            />

          <Button 
              title="Take Picture"
              onPress={
                  ()=>
                    takePicture()
              }
          />

          <Button 
              title="Upload Image"
              onPress={
                  ()=>
                    pickImage()
              }
          />

          <Button 
              title="Save"
              onPress={
                  ()=>
                    navigation.navigate('Save', { image })
              }
          />

          {image && <Image source ={{uri: image}} style={{flex: 1}}/>}
    </View>
  );
}

const styles = StyleSheet.create({
    cameraContainer: {
        flex: 1,
        flexDirection: 'row'
    },

    fixedRatio: {
        flex: 1,
        aspectRatio: 1
    }, 

    cameraButton: {
        flex: 1,
        ...Platform.select({
          ios: {
            color: '#eb4034'
          },
        }),
        color: '#eb4034',
  }


})