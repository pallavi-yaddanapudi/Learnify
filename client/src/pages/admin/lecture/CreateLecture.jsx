import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  useCreateLectureMutation,
  useGetCourseLectureQuery,
} from "@/features/api/courseApi";
import { Loader2 } from "lucide-react";
import React, {useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import Lecture from "./Lecture";

const CreateLecture = () => {
  const [lectureTitle, setLectureTitle] = useState("");
  const params = useParams();
  const courseId = params.courseId;
  const navigate = useNavigate();

  const [createLecture, { isLoading }] = useCreateLectureMutation();

  const {
    data: lectureData,
    isLoading: lectureLoading,
    isError: lectureError,
  } = useGetCourseLectureQuery(courseId);

  const createLectureHandler = async () => {
    try {
      const res = await createLecture({ lectureTitle, courseId }).unwrap();
      toast.success(res.message || "Lecture created successfully");
      setLectureTitle("");
    } catch (err) {
      toast.error(err?.data?.message || "Failed to create lecture");
    }
  };

  return (
    <div className="flex-1 mx-10">
      <div className="mb-4">
        <h1 className="font-bold text-xl mb-2">
          Let's add a course – add some basic course details for your new course
        </h1>
        <p className="text-sm mb-4">
          You can add a lecture to this course by entering a title below.
        </p>

        <div className="space-y-4">
          <div>
            <Label htmlFor="courseTitle">Title</Label>
            <Input
              type="text"
              value={lectureTitle}
              onChange={(e) => setLectureTitle(e.target.value)}
              placeholder="Your Title Name"
            />
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => navigate(`/admin/course/${courseId}`)}
            >
              Back to Course
            </Button>
            <Button disabled={isLoading} onClick={createLectureHandler}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please Wait
                </>
              ) : (
                "Create lecture"
              )}
            </Button>
          </div>

          {/* Show Lectures */}
          <div>
            {lectureLoading ? (
              <p>Loading lectures.... </p>
            ) : lectureError ? (
              <p>Failed to load lectures</p>
            ) : lectureData?.lectures?.length === 0 ? (
              <p>No Lecture available</p>
            ) : (
              lectureData.lectures.map((lecture, index) => (
                <Lecture
                  key={lecture._id}
                  lecture={lecture}
                  index={index}
                  courseId={courseId}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateLecture;
