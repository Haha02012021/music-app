<?php

namespace App\Http\Requests\Song;

use Illuminate\Foundation\Http\FormRequest;

class SongCreateRequest extends FormRequest
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
            'album_id' => ['exists:albums,id'],
            'thumbnail' => ['file'],
            'lyric' => ['string'],
            'released_at' => ['date'],
        ];
    }
}
