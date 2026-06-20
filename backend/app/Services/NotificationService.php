<?php

namespace App\Services;

use App\Models\Notification;
use App\Models\User;

class NotificationService
{
    /**
     * Send a notification to a specific user.
     *
     * @param int $userId
     * @param string $title
     * @param string $message
     * @param string $type
     * @return Notification
     */
    public function sendToUser($userId, $title, $message, $type)
    {
        return Notification::create([
            'user_id' => $userId,
            'title' => $title,
            'message' => $message,
            'type' => $type,
        ]);
    }

    /**
     * Send a notification to all users of a specific role.
     *
     * @param string $role
     * @param string $title
     * @param string $message
     * @param string $type
     * @return void
     */
    public function sendToRole($role, $title, $message, $type)
    {
        $users = User::where('role', $role)->get();

        $notifications = [];
        $now = now();
        foreach ($users as $user) {
            $notifications[] = [
                'user_id' => $user->id,
                'title' => $title,
                'message' => $message,
                'type' => $type,
                'is_read' => false,
                'created_at' => $now,
                'updated_at' => $now,
            ];
        }

        if (!empty($notifications)) {
            Notification::insert($notifications);
        }
    }
}
