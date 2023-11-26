<?php

namespace App\Http\Requests\Song;

use App\Http\Requests\CustomRequest;

class SongCreateRequest extends CustomRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'unique:songs', 'max:60'],
            'singer_ids' => ['array'],
            'genre_ids' => ['array'],
            'thumbnail' => ['file', 'mimes:jpeg,png', 'mimetypes:image/jpeg,image/png'],
            'audio' => ['file', 'mimes:mp3,wma,wav'],
            'lyric' => ['string'],
            'released_at' => ['date'],
        ];
    }
}
