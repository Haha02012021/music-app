<?php

namespace App\Http\Requests\Genre;

use App\Http\Requests\CustomRequest;

class GenreCreateRequest extends CustomRequest
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
            'name' => ['required', 'string', 'max:'.TITLE_LENGTH, 'not_regex:/`/i'],
            'title' => ['required', 'string', 'max:'.TITLE_LENGTH, 'not_regex:/`/i'],
        ];
    }
}
