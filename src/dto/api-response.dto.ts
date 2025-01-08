import { ApiProperty } from '@nestjs/swagger';

export class ApiResponseDto<T> {
  @ApiProperty({
    description: 'The HTTP status code of the response',
    example: 200
  })
    statusCode: number;

  @ApiProperty({
    description: 'A message describing the result of the request',
    example: 'Request was successful'
  })
    message: string;

  @ApiProperty({
    description: 'The actual data returned by the request (can be null)',
    example: null,
    nullable: true
  })
    data?: T;

  @ApiProperty({
    description: 'An error message, if any (only present for errors)',
    example: null,
    nullable: true
  })
    error?: string;
}