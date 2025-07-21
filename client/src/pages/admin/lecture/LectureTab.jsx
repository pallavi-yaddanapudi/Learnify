import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Label } from "@radix-ui/react-label";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import axios from "axios";
import {
  useEditLectureMutation,
  useGetLectureByIdQuery,
  useRemoveLectureMutation,
} from "@/features/api/courseApi";
import { useParams } from "react-router-dom";
import { Loader2 } from "lucide-react";


const MEDIA_API = "http://localhost:8080/api/media";

const LectureTab = () => {
  const [lectureTitle, setLectureTitle] = useState("");
  const [uploadVideoInfo, setUploadVideoInfo] = useState(null);
  const [isFree, setIsFree] = useState(false);
  const [mediaPogress, setMediaProgress] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [btnDisable, setBtnDisable] = useState(true);

  const { courseId, lectureId } = useParams();

  const {data:lectureData} = useGetLectureByIdQuery(lectureId);
  const lecture = lectureData?.lecture;
  useEffect(()=> {
    if(lecture) {
      console.log(lecture.isPreviewFree);
      setLectureTitle(lecture.lectureTitle);
      setIsFree(lecture.isPreviewFree);
      setUploadVideoInfo(lecture.videoInfo);
    }
  },[lecture]);


  const [editLecture, { data, isLoading, error, isSuccess }] =
    useEditLectureMutation();
  const [
    removeLecture,
    { data: removeData, isLoading: removeLoading, isSuccess: removeSuccess },
  ] = useRemoveLectureMutation();

  const fileChangeHandler = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      setMediaProgress(true);

      try {
        const res = await axios.post(`${MEDIA_API}/upload-video`, formData, {
          onUploadProgress: ({ loaded, total }) => {
            setUploadProgress(Math.round((loaded * 100) / total));
          },
        });

        if (res.data.success) {
          setUploadVideoInfo({
            videoUrl: res.data.data.url,
            publicId: res.data.data.public_id,
          });
          setBtnDisable(false);
          toast.success(res.data.message);
        }
      } catch (error) {
        console.error(error);
        toast.error("Error uploading video");
      } finally {
        setMediaProgress(false);
      }
    }
  };

  const editLectureHandler = async () => {
    try {
      await editLecture({
        lectureTitle,
        videoInfo: uploadVideoInfo,
        isPreviewFree:isFree,
        courseId,
        lectureId,
      });
    } catch (err) {
      console.error(err);
      toast.error("Failed to edit lecture");
    }
  };

  const removeLectureHandler = async (req, res) => {
    await removeLecture(lectureId);
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success(data.message);
    }
    if (error) {
      toast.error(error.data.message);
    }
  }, [isSuccess, error]);

  useEffect(() => {
    if (removeSuccess) {
      toast.success(removeData.message);
    }
  }, [removeSuccess]);

  return (
    <Card>
      <CardHeader className="justify-between">
        <div>
          <CardTitle>Edit Lecture</CardTitle>
          <CardDescription>
            Make changes and click save when done.
          </CardDescription>
        </div>
        <div className="flex items-center gap-2">
          <Button
            disabled={removeLoading}
            variant="destructive"
            onClick={removeLectureHandler}
          >
            {removeLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </>
            ) : (
              "Remove Lecture"
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div>
          <Label>Title</Label>
          <Input
            type="text"
            value={lectureTitle}
            onChange={(e) => setLectureTitle(e.target.value)}
            placeholder="Ex. Introduction to JavaScript"
          />
        </div>

        <div className="mt-4">
          <Label>
            Video <span className="text-red-500">*</span>
          </Label>
          <Input
            type="file"
            accept="video/*"
            onChange={fileChangeHandler}
            className="w-fit"
          />
        </div>

        <div className="flex items-center space-x-2 my-5">
          <Switch
            id="airplane-mode"
            checked={isFree}
            onCheckedChange={setIsFree}
          />
          <Label htmlFor="airplane-mode">Is this video FREE</Label>
        </div>

        {mediaPogress && (
          <div className="my-4">
            <Progress value={uploadProgress} />
            <p>{uploadProgress}% uploaded</p>
          </div>
        )}

        <div className="mt-4">
          <Button disabled={isLoading || mediaPogress} onClick={editLectureHandler}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </>
            ) : (
              "update Lecture"
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default LectureTab;
