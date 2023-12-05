<?php
namespace App\Services;

use Kreait\Firebase\Contract\Storage;

class FileService 
{
    protected Storage $storage;

    public function __construct(Storage $storage)
    {
        $this->storage = $storage;
    }

    public function uploadFile($file, $firebaseStoragePath, $name)
    {
        $firebase_storage_path = $firebaseStoragePath;  
        $extension = $file->getClientOriginalExtension();   
        $localfolder = public_path('firebase-temp-uploads') .'/';  
        $f = str_replace(' ', '-', $name).'.'.$extension;  
        $fileData = [];
        if ($file->move($localfolder, $f)) {  
            $uploadedfile = fopen($localfolder.$f, 'r');  
            $this->storage->getBucket()->upload($uploadedfile, ['name' => $firebase_storage_path . $f]);  
            $fileData['fileName'] = $f;
            if (str_contains('mp3,wma,wav', $extension)) {
                $audioMedia = new AudioFile($localfolder.$f);
                $fileData['duration'] = $audioMedia->getDuration();
            }
            //will remove from local laravel folder  
            unlink($localfolder . $f);  
            
            return $fileData;
        } else {  
            throw new \Exception('Upload file failed!');
        }  
    }

    public function uploadAudio($audio, $audioName)
    {
        $this->storage->getBucket()->upload($audio, ['name' => AUDIOES_DIR . $audioName]);
    }

    public function getFileUrl($file, $fileDir)
    {
        if ($file) {
            $file = $this->storage->getBucket()->object($fileDir.$file);
            $url = $file->signedUrl(new \DateTime('+1 hour'));

            return $url;
        }
        return null;
    }

    public function deleteFile($file, $fileDir)
    {
        if ($file && !str_contains($file, 'https')) {
            $this->storage->getBucket()->object($fileDir.$file)->delete();
        }
    }
}