import cv2
import mediapipe as mp
import numpy as np

# Initialize MediaPipe Pose
mp_pose = mp.solutions.pose
pose = mp_pose.Pose(static_image_mode=False, min_detection_confidence=0.5, min_tracking_confidence=0.5)
mp_drawing = mp.solutions.drawing_utils

# Function to calculate angle between three points
def calculate_angle(a, b, c):
    a = np.array(a)  # First point
    b = np.array(b)  # Mid point
    c = np.array(c)  # End point
    radians = np.arctan2(c[1] - b[1], c[0] - b[0]) - np.arctan2(a[1] - b[1], a[0] - b[0])
    angle = np.abs(radians * 180.0 / np.pi)
    if angle > 180.0:
        angle = 360 - angle
    return angle

# Function to process video and count exercises
def count_exercises(video_path):
    cap = cv2.VideoCapture(video_path)
    if not cap.isOpened():
        print("Error: Could not open video.")
        return None

    pushup_count = 0
    squat_count = 0
    pushup_state = "up"
    squat_state = "standing"
    pushup_threshold_down = 90  # Elbow angle for push-up down state
    pushup_threshold_up = 160   # Elbow angle for push-up up state
    squat_threshold_down = 100  # Knee angle for squat down state
    squat_threshold_up = 160    # Knee angle for squat up state

    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break

        # Convert frame to RGB for MediaPipe
        frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        results = pose.process(frame_rgb)

        if results.pose_landmarks:
            landmarks = results.pose_landmarks.landmark

            # Extract coordinates for push-up (elbow, shoulder, wrist)
            left_shoulder = [landmarks[mp_pose.PoseLandmark.LEFT_SHOULDER.value].x,
                             landmarks[mp_pose.PoseLandmark.LEFT_SHOULDER.value].y]
            left_elbow = [landmarks[mp_pose.PoseLandmark.LEFT_ELBOW.value].x,
                          landmarks[mp_pose.PoseLandmark.LEFT_ELBOW.value].y]
            left_wrist = [landmarks[mp_pose.PoseLandmark.LEFT_WRIST.value].x,
                          landmarks[mp_pose.PoseLandmark.LEFT_WRIST.value].y]

            # Extract coordinates for squat (hip, knee, ankle)
            left_hip = [landmarks[mp_pose.PoseLandmark.LEFT_HIP.value].x,
                        landmarks[mp_pose.PoseLandmark.LEFT_HIP.value].y]
            left_knee = [landmarks[mp_pose.PoseLandmark.LEFT_KNEE.value].x,
                         landmarks[mp_pose.PoseLandmark.LEFT_KNEE.value].y]
            left_ankle = [landmarks[mp_pose.PoseLandmark.LEFT_ANKLE.value].x,
                          landmarks[mp_pose.PoseLandmark.LEFT_ANKLE.value].y]

            # Calculate angles
            elbow_angle = calculate_angle(left_shoulder, left_elbow, left_wrist)
            knee_angle = calculate_angle(left_hip, left_knee, left_ankle)

            # Push-up detection
            if elbow_angle < pushup_threshold_down and pushup_state == "up":
                pushup_state = "down"
            elif elbow_angle > pushup_threshold_up and pushup_state == "down":
                pushup_state = "up"
                pushup_count += 1

            # Squat detection
            if knee_angle < squat_threshold_down and squat_state == "standing":
                squat_state = "down"
            elif knee_angle > squat_threshold_up and squat_state == "down":
                squat_state = "standing"
                squat_count += 1

            # Draw landmarks and counts on frame
            mp_drawing.draw_landmarks(frame, results.pose_landmarks, mp_pose.POSE_CONNECTIONS)
            cv2.putText(frame, f"Push-ups: {pushup_count}", (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)
            cv2.putText(frame, f"Squats: {squat_count}", (10, 60), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)

        # Display frame
        cv2.imshow("Exercise Counter", frame)
        if cv2.waitKey(1) & 0xFF == ord("q"):
            break

    cap.release()
    cv2.destroyAllWindows()
    pose.close()

    return {"pushups": pushup_count, "squats": squat_count}

# Example usage
if __name__ == "__main__":
    video_path = "pushup.mp4"  # Replace with your video path
    result = count_exercises(video_path)
    if result:
        print(f"Exercise Counts: {result}")