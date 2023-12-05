<?php

namespace App\Http\Requests\Album;

use App\Http\Requests\CustomRequest;
use Illuminate\Validation\Rule;

class AlbumCreateRequest extends CustomRequest
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
            'title' => ['required', 'string', 'not_regex:/`/i'],
            'released_at' => ['date'],
            'song_ids' => ['array'],
            'thumbnail' => ['file'],
            'audio' => ['file'],
            'description' => ['string', 'max:255'],
        ];
    }
}
