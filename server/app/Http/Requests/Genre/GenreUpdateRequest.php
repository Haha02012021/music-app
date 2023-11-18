<?php

namespace App\Http\Requests\Genre;

use App\Http\Requests\CustomRequest;

class GenreUpdateRequest extends CustomRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return false;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'id' => ['required', 'exists:genres,id'],
            'name' => ['string', 'max:'.TITLE_LENGTH],
            'title' => ['string', 'max:'.TITLE_LENGTH],
        ];
    }
}
